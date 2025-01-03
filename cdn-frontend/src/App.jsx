import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Overview,DashboardLayout, FileManager, SecuritySettings, AnalyticsDashboard } from './components/Dashboard';
import { Login } from './components/ProtectedRoute/Login';
import { Register } from './components/ProtectedRoute/Register';
import { ForgotPassword } from './components/ProtectedRoute/ForgotPassword';
import { Profile } from './components/Profile/Profile';
import { AuthProvider } from './components/ProtectedRoute/AuthProvider';
import { ProtectedRoute } from './components/ProtectedRoute/ProtectedRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/*" element={
            <ProtectedRoute>
              <DashboardLayout>
                <Routes>
                  <Route path="/overview" element={<Overview />} />
                  <Route path="/files" element={<FileManager />} />
                  <Route path="/analytics" element={<AnalyticsDashboard />} />
                  <Route path="/security" element={<SecuritySettings />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/" element={<Navigate to="/overview" replace />} />
                </Routes>
              </DashboardLayout>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;