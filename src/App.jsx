import React, { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Physics } from '@react-three/cannon';
import SimRobot from'./SimRobot';
import PedroPathVisualizer from './PedroPathVisualizer';

function ThreeDSimulation() {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative' }}>
      <div style={{ position: 'absolute', top: 20, left: 20, color: 'white', zIndex: 10, pointerEvents: 'none'}}>
        <h2 style={{ margin: '0 0 5px 0', color: '#ff5500'}}>3D Driver Simulation Mode</h2>
        <p style={{ margin: 0, color: '#aaa', fontSize: '14px' }}>Controls: <b>W/S</b> (Throttle) | <b>A/D</b> (Turning)</p>
      </div>
      <Canvas camera={{ position: [0, 10, 15], fov: 50 }}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 20, 10]} intensity={1} />
        <Physics gravity={[0, -9.81, 0]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <planetGeometry args={[30, 30]} />
          <meshStandardMaterial color="#222222" />
          </mesh>
          <SimRobot />
        </Physics>
        <OrbitControls />
      </Canvas>
    </div>
  )
}

export default function App() {
  const [mode, setMode] = useState('simulation');

  return(
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#1e1e24', margin: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
      <header style={{ height: '70px', backgroundColor: '#141419', display: 'flex', flexDirection: 'column', fontFamily: 'sans-serif' }}>
        <h1 style={{ color: '#ff9800', margin: 0, fontSize: '22px' }}>FTC Dashboard Control Center</h1>
        <div style={{ display: 'flex', gap: '15px' }}>
          <button onClick={() => setMode('visualizer')} style={{ padding: '10px 20px', backgroundColor: mode === 'visualizer' ? '#9b51e0' : '#2a2a32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>2D PedroPath Visualizer</button>
          <button onClick={() => setMode('simulation')} style={{ padding: '10px 20px', backgroundColor: mode === 'simulation' ? '#ff5500' : '#2a2a32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>3D FTC Driver Simulation</button>
        </div>
      </header>
      <main style={{ flex: 1, position: 'relative', }}>
        {mode === 'visualizer' ? <PedroPathVisualizer /> : <ThreeDSimulation />}
      </main>
    </div>
  );
}