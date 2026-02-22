import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import MainLayout from './components/Layout/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

// Screen Imports
import LoginHub from './screens/LoginHub';
import CommandDashboard from './screens/CommandDashboard';
import YoloSimulation from './screens/YoloSimulation';
import MachineHub from './screens/MachineHub';
import Academy from './screens/Academy';
import Settings from './screens/Settings';
import PreShiftChecklist from './screens/PreShiftChecklist';
import SupervisorDashboard from './screens/SupervisorDashboard';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<LoginHub />} />
            <Route path="dashboard" element={<ProtectedRoute><CommandDashboard /></ProtectedRoute>} />
            <Route path="identify" element={<ProtectedRoute><YoloSimulation /></ProtectedRoute>} />
            <Route path="machine/:id/checklist" element={<ProtectedRoute><PreShiftChecklist /></ProtectedRoute>} />
            <Route path="machine/:id" element={<ProtectedRoute><MachineHub /></ProtectedRoute>} />
            <Route path="machine/:id/academy" element={<ProtectedRoute><Academy /></ProtectedRoute>} />
            <Route path="supervisor" element={<ProtectedRoute><SupervisorDashboard /></ProtectedRoute>} />
            <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;
