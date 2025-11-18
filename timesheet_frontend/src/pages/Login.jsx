import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/authContext';
import { getSupabase } from '../lib/supabaseClient';

// PUBLIC_INTERFACE
export default function Login() {
  /**
   * Email/password login form using Supabase.
   * If Supabase isn't configured, shows a friendly notice.
   */
  const { signIn } = useAuth();
  const supabase = getSupabase();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const canSubmit = Boolean(email) && Boolean(password) && !submitting;

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { error: signInError } = await signIn({ email, password });
      if (signInError) {
        setError(signInError.message || 'Login failed');
        setSubmitting(false);
        return;
      }
      navigate(from, { replace: true });
    } catch (err) {
      setError(String(err));
      setSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: 420, margin: '32px auto' }}>
      <h2 style={{ marginBottom: 8 }}>Sign in</h2>
      {!supabase && (
        <div
          style={{
            background: '#fff8e1',
            border: '1px solid #f59e0b',
            padding: 12,
            borderRadius: 6,
            marginBottom: 12,
          }}
        >
          Supabase not configured. Please provide REACT_APP_SUPABASE_URL and
          REACT_APP_SUPABASE_ANON_KEY in environment to enable authentication.
        </div>
      )}
      <form className="container" onSubmit={onSubmit}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <label>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
              Email
            </div>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 6,
                border: '1px solid var(--border-color)',
                outline: 'none',
              }}
            />
          </label>
          <label>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
              Password
            </div>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              style={{
                width: '100%',
                padding: '10px 12px',
                borderRadius: 6,
                border: '1px solid var(--border-color)',
                outline: 'none',
              }}
            />
          </label>
          {error && (
            <div style={{ color: 'var(--error)', fontSize: 14 }} role="alert" aria-live="polite">
              {error}
            </div>
          )}
          <button
            type="submit"
            className="theme-toggle"
            disabled={!canSubmit}
            style={{ width: '100%', padding: '10px 12px' }}
          >
            {submitting ? 'Signing in…' : 'Sign in'}
          </button>
        </div>
      </form>

      <div style={{ marginTop: 16, fontSize: 13, color: 'var(--text-secondary)' }}>
        Note: For SSO (Microsoft) support, additional setup will be added later.
      </div>
    </div>
  );
}
