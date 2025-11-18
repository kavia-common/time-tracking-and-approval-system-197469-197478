import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './lib/authContext';
import { featureFlags } from './lib/featureFlags';
import NavBar from './components/Layout/NavBar';
import SideNav from './components/Layout/SideNav';
import Container from './components/Layout/Container';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';

// Simple placeholder components for route targets
const Placeholder = ({ title }) => (
  <div style={{ padding: 16 }}>
    <h2>{title}</h2>
    <p>This page is under construction.</p>
  </div>
);

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');
  const { user } = useAuth();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  const flags = featureFlags();

  return (
    <div className="App" data-theme={theme}>
      <NavBar onToggleTheme={toggleTheme} theme={theme} />
      <div className="app-shell">
        {user ? <SideNav flags={flags} /> : null}
        <main className="app-content">
          <Container>
            <Routes>
              <Route
                path="/"
                element={
                  user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />
                }
              />
              <Route path="/login" element={<Login />} />

              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Placeholder title="Dashboard" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/timesheet"
                element={
                  <ProtectedRoute>
                    <Placeholder title="Timesheet" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/approvals"
                element={
                  <ProtectedRoute requiredRole="manager">
                    <Placeholder title="Approvals" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reporting"
                element={
                  <ProtectedRoute requiredRole="hr">
                    <Placeholder title="Reporting" />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Placeholder title="Admin" />
                  </ProtectedRoute>
                }
              />
              {/* Experimental example */}
              {flags.experimentsEnabled && flags.flags.experimentalView && (
                <Route
                  path="/experimental"
                  element={
                    <ProtectedRoute>
                      <Placeholder title="Experimental" />
                    </ProtectedRoute>
                  }
                />
              )}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Container>
        </main>
      </div>
    </div>
  );
}

export default App;
