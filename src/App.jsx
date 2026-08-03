import React, { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import SimRobot from './SimRobot';
import PedroPathVisualizer from './PedroPathVisualizer';

// FIELD MAPS FOR 3D SIM //
const MAP_OPTIONS = [
  { id: 'into_the_deep', name: 'Into The Deep (2025-2025)', img: '/field_into_the_deep.jpg'}, 
  { id: 'centerstage', name: 'Centerstage (2023-2024)', img: '/field_centerstage.jpg' }, 
  { id: 'powerplay', name: 'Powerplay (2022-2023)', img: '/field_powerplay.jpg' },
];

// GROUND FLAT PLANE //
function Ground({ textureUrl }) {
  const texture = useTexture(textureUrl);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[30, 30]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}

function ThreeDSimulation({ weight, cadUrl, selectedMap, controllerConfig }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <Canvas camera={{ position: [0, 10, 15], fov: 50 }}>
        <ambientLight intensity={0.8} />
        <directionalLight position={[10, 20, 10]} intensity={1} />
        <Physics gravity={[0, -9.81, 0]}>
          <Ground textureUrl={selectedMap.img} />
          <SimRobot weight={weight} cadUrl={cadUrl} controllerConfig={controllerConfig} />
        </Physics>
        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState('simulation');
  const [robotWeight, setRobotWeight] = useState(15);
  const [cadUrl, setCadUrl] = useState(null);
  const [cadFileName, setCadFileName] = useState('');
  const [selectedMap, setSelectedMap] = useState(MAP_OPTIONS[0]);

  // CONTROLLER CONFIGURATION & GAMEPAD DETECTION //
  const [connectedGamepad, setConnectedGamepad] = useState(null);
  const [controllerConfig, setControllerConfig] = useState({
    throttleAxis: 1, 
    steerAxis: 0, 
    invertThrottle: true, 
    deadzone: 0.15,
  });

  // CONTROLLER CONNECTION DETECTION //
  useEffect(() => {
    const handleConnect = (e) => setConnectedGamepad(e.gamepad.id);
    const handleDisconnect = () => setConnectedGamepad(null);
    window.addEventListener('gamepadconnected', handleConnect);
    window.addEventListener('gamepaddisconnected', handleDisconnect);

    return () => {
      window.removeEventListener('gamepadconnected', handleConnect);
      window.removeEventListener('gamepadisconnected', handleDisconnect);
    };
  }, []);
  
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCadUrl(URL.createObjectURL(file));
      setCadFileName(file.name);
    }
  };

  return(
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#1e1e24', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif', overflow: 'hidden' }}>
      // HEADER NAVIGATION BAR //
      <header style={{ height: '70px', backgroundColor: '#141419', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 30px', borderBottom: '3px solid #ff9800' }}>
        <h1 style={{ color: 'ff9800', margin: 0, fontSize: '22px' }}>FTC Control Center</h1>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => setMode('visualizer')}
          style={{ padding: '10px 20px', backgroundColor: mode === 'visualizer' ? '#9b51e0' : '#2a2a32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>2D PedroPathing</button>

          <button onClick={() => setMode('simulation')}
          style={{ padding: '10px 20px', backgroundColor: mode === 'simulation' ? '#ff5500' : '#2a2a32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>3D Driver Simulation</button>
        </div>
      </header>

      // SETTINGS BAR [MAPS, ROBOT SETTINGS, CONTROLLER CONFIGS] //
      <div style={{ backgroundColor: '#2a2a32', padding: '10px 30px', display: 'flex', gap: '20px', alignItems: 'center', borderBottom: '1px solid #444', color: 'white', flexWrap: 'wrap' }}>
        // MAP SELECTION //
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: 'bold' }}>MAP:</label>
          <select value={selectedMap.id} onChange={(e) => setSelectedMap(MAP_OPTIONS.find(m => m.id === e.target.value))}
          style={{ padding: '5px', backgroundColor: '#111', color: '#fff', border: '1px solid #555', borderRadius: '4px' }}>
            {MAP_OPTIONS.map((map) => (
              <option key={map.id} value={map.id}>{map.name}
              </option>
            ))}
          </select>
        </div>

        // ROBOT SETTINGS //
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: 'bold' }}>
            Weight (lbs):
          </label>
          <input type="number" value={robotWeight} onChange={(e) => setRobotWeight(e.target.value)}
          style={{ width: '60px', padding: '5px', backgroundColor: '#111', color: '#fff', border: '1px solid #555', borderRadius: '4px' }} />
        </div>

        // CAD FILE UPLOAD //
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <label style={{ fontSize: '13px', fontWeight: 'bold' }}> CAD (.stl):</label>
          <input type="file" accept=".stl" onChange={handleFileUpload} style={{ color: '#4caf50', fontSize: '12px' }} />
          {cadFileName && <span style={{ color: '#4caf50', fontSize: '12px' }}>{cadFileName}</span>}
        </div>

        // GAMEPAD STATUS //
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginLeft: 'auto', backgroundColor: '#1a1a20', padding: '5px 12px', borderRadius: '6px', border: '1px solid #444' }}>
          <span style={{ fontSize: '12px', color: connectedGamepad ? '#4caf50' : '#888', fontWeight: 'bold' }}>🎮 {connectedGamepad ? 'Gamepad Connected' : 'Keyboard Active (Plug in Controller)'}</span>
          {connectedGamepad && (
            <>
              <label style={{ fontSize: '12px' }}>Invert Throttle:
                <input type="checkbox" checked={controllerConfig.inverThrottle} onChange={(e) => setControllerConfig({ ...controllerConfig, invertThrottle: e.target.checked })}
                style={{ marginLeft: '5px' }} />
              </label>

              <label style={{ fontSize: '12px' }}>Steer Axis:
                <select value={controllerConfig.steerAxis} onChange={(e) => setControllerConfig({ ...controllerConfig, steerAxis: Number(e.target.value) })}
                style={{ marginLeft: '5px', backgroundColor: '#111', color: '#fff', border: '1px solid #555' }}>
                  <option value={0}>Left Stick X (Axis 0)</option>
                  <option value={2}>Right Stick X (Axis 2)</option>
                </select>
              </label>
            </>
          )}
        </div>

      </div>

      // MAIN SCREEN VIEW //
      <main style={{ flex: 1, position: 'relative' }}>
        {mode === 'visualizer' ? (
          <PedroPathVisualizer fieldImageUrl={selectedMap.img} />
        ) : (
          <ThreeDSimulation weight={robotWeight} cadUrl={cadUrl} selectedMap={selectedMap} controllerConfig={controllerConfig} />
        )}
      </main>

    </div>
  );
}