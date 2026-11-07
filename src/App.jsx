import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Sim3D from './pages/Sim3D';
import Sim2D from './pages/Sim2D';
import Resources from './pages/Resources';

function App() {
  return (
    <Router>
      <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
        <nav style={{ display: 'flex', gap: '20px', marginBottom: '20px' }}>
          <Link to="/">Home</Link>
          <Link to="/Sim3D">3D Simulation</Link>
          <Link to="/Sim2D">2D Simulation</Link>
          <Link to="/Resources">Resources</Link>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Sim3D" element={<Sim3D />} />
          <Route path="/Sim2D" element={<Sim2D />} />
          <Route path="/Resources" element={<Resources />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;