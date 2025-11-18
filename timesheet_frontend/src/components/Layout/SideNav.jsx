import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../lib/authContext';

/**
 * Small helper to detect allowed roles.
 */
function hasAnyRole(role, allowed) {
  if (!allowed || allowed.length === 0) return true;
  return allowed.includes(role);
}

// PUBLIC_INTERFACE
export default function SideNav({ flags }) {
  /**
   * Side navigation with primary and role-gated links.
   * Shows Admin section with nested links only for admins.
   */
  const { user, role } = useAuth();
  if (!user) return null;

  const effectiveRole = role || 'employee';

  return (
    <nav className="sidenav" aria-label="Primary">
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/timesheet">Timesheet</NavLink>
      <NavLink to="/timesheet/submit">Submit Week</NavLink>
      <NavLink to="/clock">Clock</NavLink>

      {hasAnyRole(effectiveRole, ['manager']) && <NavLink to="/approvals">Approvals</NavLink>}
      {hasAnyRole(effectiveRole, ['hr', 'admin']) && <NavLink to="/reporting/exports">Reporting / Exports</NavLink>}

      {hasAnyRole(effectiveRole, ['admin']) && (
        <>
          <div style={{ marginTop: 10, marginBottom: 4, fontSize: 12, color: 'var(--text-secondary)' }}>
            Admin
          </div>
          <NavLink to="/admin/users-roles">Users & Roles</NavLink>
          <NavLink to="/admin/projects-tasks">Projects & Tasks</NavLink>
          <NavLink to="/admin/holidays-absences">Holidays & Absences</NavLink>
          <NavLink to="/admin/settings">Settings</NavLink>
          <NavLink to="/admin/audit-logs">Audit Logs</NavLink>
        </>
      )}

      {flags?.experimentsEnabled && flags?.flags?.experimentalView && (
        <NavLink to="/experimental">Experimental</NavLink>
      )}
    </nav>
  );
}
