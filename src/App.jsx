import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './utils/PrivateRoute';

import LandingPage from './pages/LandingPage';
import DashboardLayout from './pages/DashboardLayout';
import DashboardPage from './pages/DashboardPage';
import EditorPage from './pages/EditorPage';
import ProjectsPage from './pages/ProjectsPage';
import SettingsPage from './pages/SettingsPage';
import BatchProcessor from './components/features/batch/BatchProcessor';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NotFoundPage from './pages/NotFoundPage';
import { ImageProvider } from './context/ImageContext';
import GlobalErrorBoundary from './utils/GlobalErrorBoundary';
import { ToastProvider } from './components/ui/Toast';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GlobalErrorBoundary>
        <ToastProvider>
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
                    <Route index element={<DashboardPage />} />
                    <Route path="restoration" element={<EditorPage />} />
                    <Route path="batch" element={<BatchProcessor />} />
                    <Route path="projects" element={<ProjectsPage />} />
                    <Route path="settings" element={<SettingsPage />} />
                  </Route>
                  {/* 404 Page */}
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </ImageProvider>
            </AuthProvider>
          </Router>
        </ToastProvider>
      </GlobalErrorBoundary>
    </QueryClientProvider>
  );
}

export default App;
