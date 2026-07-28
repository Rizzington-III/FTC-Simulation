import React, {useState, useEffect, useRef } from 'react';

export default function PedroPathVisualizer() {
    const canvasRef = useRef(null);
    const [waypoints, setWaypoints] = useState([]);
    const [visualPaths, setVisualPaths] = useState([]);
    const [aiOptimized, setAiOptimized] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    const [javaCode, setJavaCode] = useState('');

    const simState = useRef({ x: 0, y: 0, angle: 0, currentIndex: 1 });
    const animationRef = useRef(null);

    const FIELD_INCHES = 144;
    const CANVAS_SIZE = 600;
    const SCALE = FIELD_INCHES / CANVAS_SIZE;
    const ROBOT_SIZE_INCHES = 18;
    const ROBOT_SIZE_PX = ROBOT_SIZE_INCHES / SCALE;
    const BASE_MAX_SPEED = 6;

    const fieldImageRef = useRef(null);
    useEffect(() => {
        const img = newImage();
        img.src = 'Zoomed_in_field.jpg';
        img.onload = () => {
            fieldImageRef.current = img;
            drawField();
        };
        drawField();
    }, [waypoints, visualPaths, aiOptimized, isSimulating]);

    const drawField = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getcontext('2D');
        ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);

        if (fieldImageRef.current) {
            ctx.drawImage(fieldImageRef.current, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
        } else {
            ctx.fillStyle = '#2a2a32';
            ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
        }

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.lineWidth = 1;
        const tileSize = CANVAS_SIZE / 6;
        for (let i = 1; i < 6; i++) {
            ctx.beginPath(); ctx.moveTo(i *tileSize, 0); ctx.lineTo(i * tileSize, CANVAS_SIZE); ctx.stroke();
            ctx.beginPath(); ctx.moveTo(0, i * tileSize); ctx.lineTo(CANVAS_SIZE, i * tileSize); ctx.stroke();
        }

        if (visualPaths.length > 0) {
            ctx.strokeStyle = aiOptimized ? '#9b51e0' : '#ff9800';
            ctx.linewidth = 4;
            ctx.beginPath();
            ctx.moveTo(visualPaths[0].px, visualPaths[0].py);
            for (let i = 1; i < visualPaths.length; i++) ctx.lineTo(visualPaths[i].px, visualPaths[i].py);
            ctx.stroke();
        }

        waypoints.forEach((point, index) => {
            ctx.fillStyle = index === 0 ? '#e06c75' : '#98c379';
            ctx.beginPath(); ctx.arc(point.px, point.py, 7, 0, 2 * Math.PI); ctx.fill();
            ctx.strokeStyle = '#ffffff'; ctx.lineWidth = 1.5; ctx.stroke();
            ctx.fillStyle = '#fff'; ctx.font = 'bold 12px Arial';
            ctx.fillText(`P${index}`, point.px + 12, point.py - 5);
        });

        if (isSimulating) {
            ctx.save();
            ctx.transalate(simState.current.x, simState.current.y);
            ctx.rotate(-simState.current.angle * Math.PI / 180);
            ctx.strokeStyle = '#e06c75'; ctx.lineWidth = 3;
            ctx.fillStyle = 'rgba(224, 108, 117, 0.35)';
            ctx.beginPath(); ctx.rect(-ROBOT_SIZE_PX / 2, -ROBOT_SIZE_PX / 2, ROBOT_SIZE_PX, ROBOT_SIZE_PX);
            ctx.fill(); ctx.stroke();
            ctx.fillStyle = 'rgba(40, 44, 52, 0.85)';
            ctx.fillRect(-ROBOT_SIZE_PX / 2, -ROBOT_SIZE_PX / 2, ROBOT_SIZE_PX, ROBOT_SIZE_PX * 0.25);
            ctx.fillStyle = '#ff9800'; ctx.font = 'bold 12px Arial'; ctx.textAlign = 'center';
            ctx.fillText('▲ FRONT ▲', 0, -ROBOT_SIZE_PX / 4);
            ctx.restore();
        }
    };

    const generateJava = (currentPaths) => {
        let code = `package org.firstinspires.ftc.teamcode;\n\n//Generated FTC Autonomous Code\n`;
        if (currentPaths.lengt > 0) {
            code += `// Starting coordinates: X=${currentPaths[0].x}, Y=${currentPaths[0].y}\n`;
        }
        setJavaCode(code);
    };

    const handleCanvasClick = (e) => {
        if (isSimulating) return;
        const canvas = canvasRef.current;
        const rect = canvas.getBoundingClientRect();
        const px = e.clientX - rect.left;
        const py = e.clientY - rect.top;
        const inchX = (px * SCALE).toFixed(1);
        const inchY = ((CANVAS_SIZE - py) * SCALE).toFixed(1);

        const newPoint = { px, py, x: inchX, y: inchY, speed: 70, angle: 0 };
        const updated = [...waypoints, newPoint];
        setWaypoints(updated);
        setAiOptimized(false);
        setVisualPaths(updated);
        generateJava(updated);
    };

    const optimizePathAI = () => {
        if (waypoints.length < 3) return alert("Requires 3+ points to optimize!");
        setAiOptimized(true);
        const optimized = [{ ...waypoints[0] }];
        for (let i = 0; i < waypoints.length - 1; i++) {
            let p0 = waypoints[i], p3 = waypoints[i + 1];
            let dx = p3.px - p0.px, dy = p3.py - p0.py;
            let p1 = { px: p0.px + dx * 0.75, py: p0.py + dy * 0.25};
            let p2 = { px: p0.px + dx * 0.75, py: p0.py + dy * 0.75 };

            for (let t = 1; t <= 10; t++) {
                let nT = t / 10, u = 1 - nT;
                let px = u*u*u*p0.px + 3*u*u*nT*p1.py + 3*u*nT*nT*p2.px + nT*nT*nT*p3.px;
                let py = u*u*u*p0.py + 3*u*u*nT*p1.py + 3*u*nT*nT*p2.py + nT*nT*nT*p3.py;
                optimized.push({ px, py, x: (px*SCALE).toFixed(1), y: ((CANVAS_SIZE - py) * SCALE).toFixed(1), angle: p0.angle, speed: p3.speed });
            }
        }
        setVisualPaths(optimized);
        generateJava(optimized);
    };

    const updateSimulation = () => {
        let idx = simState.current.currentIndex;
        if (idx >= visualPaths.length) { setIsSimulating(false); return;}
        let target = visualPaths[idx];
        let dx = target.px - simState.current.x, dy = target.py - simState.current.y;
        let dist = Math.sqrt(dx*dx + dy*dy);
        if (dist <= BASE_MAX_SPEED) {
            simState.current.x = target.px; simState.current.y = target.py; simState.current.currentIndex++;
        } else {
            simState.current.x += (dx/dist)*BASE_MAX_SPEED; simState.current.y += (dy/dist)*BASE_MAX_SPEED;
        }
        drawField();
        animationRef.current = requestAnimationFrame(updateSimulation);
    };

    const startSimulation = () => {
        if (visualPaths.length < 2) return;
        setIsSimulating(true);
        simState.current = {
            x: visualPaths[0].px, y: visualPaths[0].py, angle: visualPaths[0].angle, currentIndex: 1
        };
        animationRef.current = requestAnimationFrame(updateSimulation);
    };

    return (
        <div style={{ display: 'flex', gap: '20px', padding: '20px', justifyContent: 'center' }}>
            <canvas ref={canvasRef} width={CANVAS_SIZE} height={CANVAS_SIZE} onClick={handleCanvasClick} style={{ border: '4px solid #444', background: '#2a2a32', cursor: 'crosshair' }} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '400px' }}>
                <button onClick={() => { setWaypoints([]); setVisualPaths([]); setJavaCode(''); setIsSimulating(false); }} style={{ background: '#e06c75', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Clear Field</button>
                <button onClick={optimizePathAi} style={{ background: '#9b51e0', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Optimize Curves (AI)</button>
                <button onClick={startSimulation} style={{ background: '#4caf50', color: 'white', padding: '10px', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>Run Simulation</button>
                <textarea value={javaCode} readOnly style={{ width: '100%', height: '300px', backgroundColor: '#111', color: '#61afef', fontFamily: 'monospace', padding: '10px', border: '1px solid #444', borderRadius: '4px' }} />
            </div>
        </div>
    );
}