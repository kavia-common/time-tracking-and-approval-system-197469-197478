import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/authContext';

// PUBLIC_INTERFACE
export default function ProtectedRoute({ children, requiredRole = null }) {
  /**
   * Guards routes by checking authentication and optional required role.
   * Redirects unauthenticated users to /login with state.from for post-login navigation.
   */
  const { user, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div style={{ padding: 16 }}>Loading…</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (requiredRole && role !== requiredRole) {
    // For now, just redirect to dashboard; later show 403 or request elevation
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
