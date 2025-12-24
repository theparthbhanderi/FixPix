import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';

import LandingPage from './pages/LandingPage';
import DashboardLayout from './pages/DashboardLayout';
import EditorPage from './pages/EditorPage';
import ProjectsPage from './pages/ProjectsPage';
import SettingsPage from './pages/SettingsPage';
import BatchProcessor from './components/features/batch/BatchProcessor';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import { ImageProvider } from './context/ImageContext';
import GlobalErrorBoundary from './utils/GlobalErrorBoundary';

function App() {
  return (
    <GlobalErrorBoundary>
      <Router>
        <AuthProvider>
          <ImageProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route
                path="/app"
                element={
                  <PrivateRoute>
                    <DashboardLayout />
                  </PrivateRoute>
                }
              >
                <Route index element={<Navigate to="restoration" replace />} />
                <Route path="restoration" element={<EditorPage />} />
                <Route path="batch" element={<BatchProcessor />} />
                <Route path="projects" element={<ProjectsPage />} />
                <Route path="settings" element={<SettingsPage />} />
              </Route>
              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </ImageProvider>
        </AuthProvider>
      </Router>
    </GlobalErrorBoundary>
  );
}

export default App;
