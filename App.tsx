
import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { ClientsPage } from './pages/ClientsPage';
import { Layout } from './components/Layout';

const App: React.FC = () => {
  return (
    <HashRouter>
      <AuthProvider>
        <NotificationProvider>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/clients" element={<ClientsPage />} />
                <Route path="/" element={<Navigate to="/clients" replace />} />
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/clients" replace />} />
          </Routes>
        </NotificationProvider>
      </AuthProvider>
    </HashRouter>
  );
};

export default App;
