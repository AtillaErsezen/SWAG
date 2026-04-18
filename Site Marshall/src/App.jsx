import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Screen Imports
import LoginHub from './screens/LoginHub';
import SiteSelector from './screens/SiteSelector';
import MediaPermissions from './screens/MediaPermissions';
import ScannerPage from './screens/ScannerPage';
import CommandDashboard from './screens/CommandDashboard';
import YoloSimulation from './screens/YoloSimulation';
import MachineHub from './screens/MachineHub';
import Academy from './screens/Academy';
import PreShiftChecklist from './screens/PreShiftChecklist';
import SupervisorDashboard from './screens/SupervisorDashboard';
import IncidentReport from './screens/IncidentReport';
import BugReport from './screens/BugReport';

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
            <Route path="dashboard" element={<ProtectedRoute><CommandDashboard /></ProtectedRoute>} />
            <Route path="identify" element={<ProtectedRoute><YoloSimulation /></ProtectedRoute>} />
            <Route path="machine/:id/checklist" element={<ProtectedRoute><PreShiftChecklist /></ProtectedRoute>} />
            <Route path="machine/:id" element={<ProtectedRoute><MachineHub /></ProtectedRoute>} />
            <Route path="machine/:id/academy" element={<ProtectedRoute><Academy /></ProtectedRoute>} />
            <Route path="supervisor" element={<ProtectedRoute><SupervisorDashboard /></ProtectedRoute>} />
            <Route path="incident" element={<ProtectedRoute><IncidentReport /></ProtectedRoute>} />
            <Route path="bug-report" element={<ProtectedRoute><BugReport /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
