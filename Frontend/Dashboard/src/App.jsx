import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import DashboardLayout from './components/DashboardLayout';
import Overview from './pages/Overview';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

const App = () => {
  const isAuthenticated = useSelector((state) => state.auth?.isAuthenticated);

  // Redirect to login if not authenticated (when running standalone)
  if (!isAuthenticated && typeof window !== 'undefined' && window.location.pathname.startsWith('/dashboard')) {
    // When running as remote, shell handles auth
  }

  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<Overview />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
};

export default App;
