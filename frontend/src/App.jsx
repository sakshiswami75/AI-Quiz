import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import TeamSelect from './pages/TeamSelect';
import Register from './pages/Register';
import TeamLogin from './pages/TeamLogin';
import Briefing from './pages/Briefing';
import Quiz from './pages/Quiz';
import Done from './pages/Done';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import { TeamRoute, AdminRoute } from './components/ProtectedRoute';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/team" element={<TeamSelect />} />
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<TeamLogin />} />
      <Route path="/briefing" element={<TeamRoute><Briefing /></TeamRoute>} />
      <Route path="/quiz" element={<TeamRoute><Quiz /></TeamRoute>} />
      <Route path="/done" element={<TeamRoute><Done /></TeamRoute>} />
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
