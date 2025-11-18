import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../lib/authContext';

// PUBLIC_INTERFACE
export default function SideNav({ flags }) {
  /**
   * Side navigation with primary and role-gated links.
   */
  const { user, role } = useAuth();
  if (!user) return null;

  return (
    <nav className="sidenav" aria-label="Primary">
      <NavLink to="/dashboard">Dashboard</NavLink>
      <NavLink to="/timesheet">Timesheet</NavLink>
      <NavLink to="/timesheet/submit">Submit Week</NavLink>
      <NavLink to="/clock">Clock</NavLink>
      {role === 'manager' && <NavLink to="/approvals">Approvals</NavLink>}
      {(role === 'hr' || role === 'admin') && <NavLink to="/reporting">Reporting</NavLink>}
      {role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
      {flags?.experimentsEnabled && flags?.flags?.experimentalView && (
        <NavLink to="/experimental">Experimental</NavLink>
      )}
    </nav>
  );
}
