import './styles/index.css';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Bookings from './pages/Bookings';
import NearbyWorkers from './pages/NearbyWorkers';
import WorkerDashboard from './pages/WorkerDashboard';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/bookings" element={<Bookings />} />
      <Route path="/nearby-workers" element={<NearbyWorkers />} />
      <Route path="/worker-dashboard" element={<WorkerDashboard />} />
    </Routes>
  );
}
