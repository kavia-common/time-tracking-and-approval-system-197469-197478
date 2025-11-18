import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/authContext';

// PUBLIC_INTERFACE
export default function ProtectedRoute({ children, requiredRole = null }) {
  /**
   * Guards routes by checking authentication and optional required role.
   * Redirects unauthenticated users to /login with state.from for post-login navigation.
   * Graceful role fallback: if role not yet resolved, show a lightweight loading state.
   */
  const { user, role, loading } = useAuth();
  const location = useLocation();

  // While session/role is resolving, render a minimal loader to prevent flicker.
  if (loading) {
    return <div style={{ padding: 16 }}>Loading…</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If a role is required, ensure role is present; default missing role to 'employee'
  const effectiveRole = role || 'employee';
  if (requiredRole && effectiveRole !== requiredRole) {
    // Optionally, we could render 403; for MVP redirect to dashboard.
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
