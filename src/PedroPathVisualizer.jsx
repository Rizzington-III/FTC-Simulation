import React, { useRef, useEffect, useState } from 'react';

export default function PedroPathVisualizer({ fieldImageUrl = '/field_into_the_deep.jpg' }) {
  const canvasRef = useRef(null);
  const [points, setPoints] = useState([
    { x: 100, y: 500 },
    { x: 300, y: 300 },
    { x: 500, y: 100 }
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Helper function to render path lines and waypoints
    const drawOverlay = () => {
      // Draw Path Line
      ctx.beginPath();
      ctx.strokeStyle = '#9b51e0';
      ctx.lineWidth = 4;
      points.forEach((p, index) => {
        if (index === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.stroke();

      // Draw Waypoints
      points.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 8, 0, 2 * Math.PI);
        ctx.fillStyle = '#ff9800';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
      });
    };

    const img = new Image();
    img.src = fieldImageUrl;

    // If image loads successfully
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      drawOverlay();
    };

    // Fallback: If image fails/missing, draw canvas background + paths so it never turns blank
    img.onerror = () => {
      ctx.fillStyle = '#1c1c24';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      drawOverlay();
    };
  }, [fieldImageUrl, points]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', backgroundColor: '#121216', padding: '20px' }}>
      <h3 style={{ color: '#fff', marginBottom: '10px' }}>2D PedroPath Autonomous Generator</h3>
      <div style={{ position: 'relative', border: '3px solid #333', borderRadius: '8px', overflow: 'hidden' }}>
        <canvas 
          ref={canvasRef} 
          width={600} 
          height={600} 
          style={{ display: 'block', backgroundColor: '#222' }} 
        />
      </div>
      <p style={{ color: '#aaa', fontSize: '12px', marginTop: '10px' }}>
        Field visualizer active • Select waypoints to plot custom paths.
      </p>
    </div>
  );
}