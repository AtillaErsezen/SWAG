import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { useAppContext } from './context/AppContext';
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

import LoginHub from './screens/LoginHub';
import SiteSelector from './screens/SiteSelector';
import MediaPermissions from './screens/MediaPermissions';
import ScannerPage from './screens/ScannerPage';
import MachineHub from './screens/MachineHub';
import Academy from './screens/Academy';
import IncidentReport from './screens/IncidentReport';
import BugReport from './screens/BugReport';
import ManagerDashboard from './screens/ManagerDashboard';
import WorkerInbox from './screens/WorkerInbox';
import ProfilePage from './screens/ProfilePage';
import Messages from './screens/Messages';

const ManagerRoute = ({ children }) => {
    const { session, authLoading, userRole } = useAppContext();
    if (authLoading) return null;
    if (!session) return <Navigate to="/" replace />;
    if (userRole !== 'manager') return <Navigate to="/scanner" replace />;
    return children;
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LoginHub />} />
            <Route path="site-selector" element={<ProtectedRoute><SiteSelector /></ProtectedRoute>} />
            <Route path="permissions" element={<ProtectedRoute><MediaPermissions /></ProtectedRoute>} />
            <Route path="scanner" element={<ProtectedRoute><ScannerPage /></ProtectedRoute>} />
            <Route path="machine/:id" element={<ProtectedRoute><MachineHub /></ProtectedRoute>} />
            <Route path="machine/:id/academy" element={<ProtectedRoute><Academy /></ProtectedRoute>} />
            <Route path="incident" element={<ProtectedRoute><IncidentReport /></ProtectedRoute>} />
            <Route path="bug-report" element={<ProtectedRoute><BugReport /></ProtectedRoute>} />
            <Route path="inbox" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
            <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
            <Route path="manager" element={<ManagerRoute><ManagerDashboard /></ManagerRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
