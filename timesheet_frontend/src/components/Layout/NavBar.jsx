import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/authContext';

// PUBLIC_INTERFACE
export default function NavBar({ onToggleTheme, theme }) {
  /**
   * Top navigation bar with app title, basic actions, and auth controls.
   */
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-title" aria-label="Chronose Home">
          Chronose
        </Link>
      </div>
      <div className="navbar-right" style={{ display: 'flex', gap: 8 }}>
        <button className="theme-toggle" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === 'light' ? '🌙' : '☀️'}
        </button>
        {user ? (
          <>
            <span style={{ alignSelf: 'center', color: 'var(--text-secondary)', fontSize: 14 }}>
              {user.email}
            </span>
            <button className="theme-toggle" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <Link to="/login" className="theme-toggle" style={{ textDecoration: 'none' }}>
            Login
          </Link>
        )}
      </div>
    </header>
  );
}
