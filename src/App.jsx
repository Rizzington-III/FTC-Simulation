import React, { useState, useEffect, Suspense, Component } from 'react';
import { Canvas, useLoader } from '@react-three/fiber';
import { OrbitControls, useTexture } from '@react-three/drei';
import { Physics, usePlane } from '@react-three/cannon';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import SimRobot from './SimRobot';
import PedroPathVisualizer from './PedroPathVisualizer';

// Field Map Options
const MAP_OPTIONS = [
  { id: 'into_the_deep', name: 'Into The Deep (2024-2025)', img: '/field_into_the_deep.jpg' },
  { id: 'centerstage', name: 'Centerstage (2023-2024)', img: '/field_centerstage.jpg' },
  { id: 'powerplay', name: 'Powerplay (2022-2023)', img: '/field_powerplay.jpg' },
];

// Error Boundary to prevent white screen crashes
class ThreeErrorCatch extends Component {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(err) {
    console.warn("3D Render Error caught:", err);
  }
  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}

// Solid Ground Plane
function Ground({ textureUrl }) {
  const [ref] = usePlane(() => ({
    rotation: [-Math.PI / 2, 0, 0],
    position: [0, 0, 0],
  }));

  try {
    const texture = useTexture(textureUrl);
    return (
      <mesh ref={ref} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial map={texture} />
      </mesh>
    );
  } catch (err) {
    return (
      <mesh ref={ref} receiveShadow>
        <planeGeometry args={[30, 30]} />
        <meshStandardMaterial color="#222222" />
      </mesh>
    );
  }
}

// STL Loader for Field Models (Only renders if valid URL is provided)
function FieldCADModel({ url }) {
  if (!url) return null;
  try {
    const geometry = useLoader(STLLoader, url);
    return (
      <mesh geometry={geometry} position={[0, 0, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.001}>
        <meshStandardMaterial color="#777788" metalness={0.3} roughness={0.4} />
      </mesh>
    );
  } catch (err) {
    return null;
  }
}

function ThreeDSimulation({ weight, cadUrl, fieldCadUrl, selectedMap, controllerConfig }) {
  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', backgroundColor: '#111115' }}>
      <Canvas 
        camera={{ position: [0, 12, 16], fov: 50 }}
        gl={{ powerPreference: "high-performance", antialias: true, preserveDrawingBuffer: true }}
      >
        <ambientLight intensity={0.9} />
        <directionalLight position={[10, 20, 10]} intensity={1.2} />
        
        <Suspense fallback={null}>
          <ThreeErrorCatch>
            <Physics gravity={[0, -9.81, 0]}>
              <Ground textureUrl={selectedMap.img} />
              <FieldCADModel url={fieldCadUrl} />
              <SimRobot weight={weight} cadUrl={cadUrl} controllerConfig={controllerConfig} />
            </Physics>
          </ThreeErrorCatch>
        </Suspense>

        <OrbitControls />
      </Canvas>
    </div>
  );
}

export default function App() {
  const [mode, setMode] = useState('simulation');
  const [robotWeight, setRobotWeight] = useState(15);
  const [robotCadUrl, setRobotCadUrl] = useState(null);
  const [fieldCadUrl, setFieldCadUrl] = useState(null);
  const [selectedMap, setSelectedMap] = useState(MAP_OPTIONS[0]);

  const [connectedGamepad, setConnectedGamepad] = useState(null);
  const [controllerConfig, setControllerConfig] = useState({
    throttleAxis: 1,
    steerAxis: 0,
    invertThrottle: true,
    deadzone: 0.15,
  });

  useEffect(() => {
    const handleConnect = (e) => setConnectedGamepad(e.gamepad.id);
    const handleDisconnect = () => setConnectedGamepad(null);

    window.addEventListener('gamepadconnected', handleConnect);
    window.addEventListener('gamepaddisconnected', handleDisconnect);

    return () => {
      window.removeEventListener('gamepadconnected', handleConnect);
      window.removeEventListener('gamepaddisconnected', handleDisconnect);
    };
  }, []);

  // Handle Robot CAD Upload
  const handleRobotUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setRobotCadUrl(URL.createObjectURL(file));
    }
  };

  // Handle Field CAD Upload
  const handleFieldUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFieldCadUrl(URL.createObjectURL(file));
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', backgroundColor: '#18181c', display: 'flex', flexDirection: 'column', fontFamily: 'Segoe UI, sans-serif', overflow: 'hidden' }}>
      
      {/* Header Bar */}
      <header style={{ height: '60px', backgroundColor: '#101014', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', borderBottom: '2px solid #333' }}>
        <h1 style={{ color: '#ff9800', margin: 0, fontSize: '20px', fontWeight: 'bold' }}>FTC Control Center</h1>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setMode('visualizer')} 
            style={{ padding: '8px 16px', backgroundColor: mode === 'visualizer' ? '#9b51e0' : '#2a2a32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            2D PedroPath
          </button>
          <button 
            onClick={() => setMode('simulation')} 
            style={{ padding: '8px 16px', backgroundColor: mode === 'simulation' ? '#ff5500' : '#2a2a32', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>
            3D Driver Sim
          </button>
        </div>
      </header>

      {/* Control Ribbon */}
      <div style={{ backgroundColor: '#22222a', padding: '8px 20px', display: 'flex', gap: '20px', alignItems: 'center', borderBottom: '1px solid #333', color: 'white', flexWrap: 'wrap' }}>
        
        {/* Map Option Dropdown */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Season Map:</label>
          <select 
            value={selectedMap.id}
            onChange={(e) => setSelectedMap(MAP_OPTIONS.find(m => m.id === e.target.value))}
            style={{ padding: '4px', backgroundColor: '#111', color: '#fff', border: '1px solid #444', borderRadius: '4px', fontSize: '12px' }}>
            {MAP_OPTIONS.map(map => (
              <option key={map.id} value={map.id}>{map.name}</option>
            ))}
          </select>
        </div>

        {/* Robot Mass Input */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Weight (lbs):</label>
          <input 
            type="number" 
            value={robotWeight} 
            onChange={(e) => setRobotWeight(e.target.value)}
            style={{ width: '50px', padding: '4px', backgroundColor: '#111', color: '#fff', border: '1px solid #444', borderRadius: '4px', fontSize: '12px' }}
          />
        </div>

        {/* Load Robot STL File */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Open Robot CAD (.stl):</label>
          <input type="file" accept=".stl" onChange={handleRobotUpload} style={{ color: '#aaa', fontSize: '11px' }} />
        </div>

        {/* Load Field STL File */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <label style={{ fontSize: '12px', fontWeight: 'bold' }}>Open Field CAD (.stl):</label>
          <input type="file" accept=".stl" onChange={handleFieldUpload} style={{ color: '#aaa', fontSize: '11px' }} />
        </div>

      </div>

      {/* View Panel */}
      <main style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
        {mode === 'visualizer' ? (
          <PedroPathVisualizer fieldImageUrl={selectedMap.img} />
        ) : (
          <ThreeDSimulation 
            weight={robotWeight} 
            cadUrl={robotCadUrl} 
            fieldCadUrl={fieldCadUrl} 
            selectedMap={selectedMap} 
            controllerConfig={controllerConfig} 
          />
        )}
      </main>

    </div>
  );
}