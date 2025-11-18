import React, { useState, useEffect } from 'react';
import './App.css';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './lib/authContext';
import { featureFlags } from './lib/featureFlags';
import NavBar from './components/Layout/NavBar';
import SideNav from './components/Layout/SideNav';
import Container from './components/Layout/Container';
import SupabaseEnvBanner from './components/Diagnostics/SupabaseEnvBanner';
import ProtectedRoute from './routes/ProtectedRoute';
import Login from './pages/Login';
import WeeklyGrid from './pages/WeeklyGrid';
import SubmitWeek from './pages/SubmitWeek';
import Clock from './pages/Clock';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerApprovals from './pages/ManagerApprovals';
import HRAttendance from './pages/HRAttendance';
import Exports from './pages/Reporting/Exports';
import UsersRoles from './pages/Admin/UsersRoles';
import ProjectsTasks from './pages/Admin/ProjectsTasks';
import HolidaysAbsences from './pages/Admin/HolidaysAbsences';
import Settings from './pages/Admin/Settings';
import AuditLogs from './pages/Admin/AuditLogs';

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
      <SupabaseEnvBanner />
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
                    <EmployeeDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/timesheet"
                element={
                  <ProtectedRoute>
                    <WeeklyGrid />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/timesheet/submit"
                element={
                  <ProtectedRoute>
                    <SubmitWeek />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clock"
                element={
                  <ProtectedRoute>
                    <Clock />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/approvals"
                element={
                  <ProtectedRoute requiredRole="manager">
                    <ManagerApprovals />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/reporting/exports"
                element={
                  <ProtectedRoute requiredRole="hr">
                    <Exports />
                  </ProtectedRoute>
                }
              />
              {/* Admin nested routes */}
              <Route
                path="/admin/users-roles"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <UsersRoles />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/projects-tasks"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <ProjectsTasks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/holidays-absences"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <HolidaysAbsences />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/settings"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/audit-logs"
                element={
                  <ProtectedRoute requiredRole="admin">
                    <AuditLogs />
                  </ProtectedRoute>
                }
              />

              {/* Experimental example */}
              {flags.experimentsEnabled && flags.flags.experimentalView && (
                <Route
                  path="/experimental"
                  element={
                    <ProtectedRoute>
                      <div style={{ padding: 16 }}>
                        <h2>Experimental</h2>
                        <p>This page is under construction.</p>
                      </div>
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
