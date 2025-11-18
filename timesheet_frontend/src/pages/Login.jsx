import React, { useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../lib/authContext';
import { getSupabase } from '../lib/supabaseClient';
import { featureFlags } from '../lib/featureFlags';

/**
 * INTERNAL: Safe getter for env variables without exposing to logs.
 */
function getEnv(name) {
  const v = process.env[name];
  return v && String(v).trim().length > 0 ? String(v).trim() : null;
}

/**
 * INTERNAL: Mask value preserving only last N characters.
 * Never log or console the raw value.
 */
function maskTail(value, keep = 4) {
  if (!value) return '';
  const s = String(value);
  if (s.length <= keep) return '*'.repeat(Math.max(4, s.length));
  const tail = s.slice(-keep);
  return `${'*'.repeat(s.length - keep)}${tail}`;
}

/**
 * INTERNAL: Should diagnostics be visible on Login page?
 * - Show in non-production (NODE_ENV !== 'production')
 * - Or when REACT_APP_FEATURE_FLAGS includes 'diagnostics'
 */
function shouldShowDiagnostics() {
  const nodeEnv = process.env.NODE_ENV;
  const { flags } = featureFlags();
  return nodeEnv !== 'production' || Boolean(flags.diagnostics);
}

// PUBLIC_INTERFACE
export default function Login() {
  /**
   * Email/password login form using Supabase.
   * If Supabase isn't configured, shows a friendly notice.
   * Adds diagnostics (non-production or diagnostics flag) showing which Supabase env vars
   * are detected at runtime with masked values and inline troubleshooting guidance.
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

  // Diagnostics computation (no console logs, never expose full secrets)
  const diag = useMemo(() => {
    const url = getEnv('REACT_APP_SUPABASE_URL');
    // Support alternate key name noted in container env reference
    const key = getEnv('REACT_APP_SUPABASE_ANON_KEY') || getEnv('REACT_APP_SUPABASE_KEY');
    const hasUrl = Boolean(url);
    const hasKey = Boolean(key);
    const maskedUrl = hasUrl ? `${url.split('//')[0]}//…${url.slice(-8)}` : '';
    const maskedKey = hasKey ? maskTail(key, 4) : '';
    const missing = [];
    if (!hasUrl) missing.push('REACT_APP_SUPABASE_URL');
    if (!hasKey) missing.push('REACT_APP_SUPABASE_ANON_KEY');
    return { hasUrl, hasKey, maskedUrl, maskedKey, missing, show: shouldShowDiagnostics() };
  }, []);

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

  // Simple inline styles consistent with Ocean Professional theme
  const calloutStyle = {
    background: '#fff8e1',
    border: '1px solid #f59e0b',
    padding: 12,
    borderRadius: 6,
    marginBottom: 12,
  };
  const diagBox = {
    background: 'var(--bg-secondary)',
    border: '1px dashed var(--border-color)',
    padding: 10,
    borderRadius: 6,
    marginBottom: 12,
    color: 'var(--text-secondary)',
    fontSize: 12,
  };
  const mono = {
    fontFamily:
      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
    color: 'var(--text-primary)',
  };

  return (
    <div style={{ maxWidth: 420, margin: '32px auto' }}>
      <h2 style={{ marginBottom: 8 }}>Sign in</h2>

      {!supabase && (
        <div style={calloutStyle}>
          Supabase not configured. Please provide REACT_APP_SUPABASE_URL and
          REACT_APP_SUPABASE_ANON_KEY in environment to enable authentication.
        </div>
      )}

      {/* Runtime diagnostics (safe, masked). Visible in non-production or when diagnostics flag enabled) */}
      {diag.show && (
        <div role="region" aria-label="Supabase environment diagnostics" style={diagBox}>
          <div style={{ marginBottom: 6 }}>
            <strong style={{ color: 'var(--primary)' }}>Diagnostics</strong>{' '}
            <span style={{ marginLeft: 8 }}>
              URL {diag.hasUrl ? '✓' : '✕'} · KEY {diag.hasKey ? '✓' : '✕'}
            </span>
          </div>
          {diag.hasUrl && (
            <div>
              REACT_APP_SUPABASE_URL: <span style={mono}>{diag.maskedUrl}</span>
            </div>
          )}
          {diag.hasKey && (
            <div>
              REACT_APP_SUPABASE_ANON_KEY: <span style={mono}>{diag.maskedKey}</span>
            </div>
          )}
          {(!diag.hasUrl || !diag.hasKey) && (
            <div style={{ marginTop: 6 }}>
              Missing:{' '}
              <strong style={{ color: 'var(--error)' }}>
                {diag.missing.join(', ')}
              </strong>
              <div style={{ marginTop: 6 }}>
                Troubleshooting:
                <ul style={{ marginTop: 4, marginBottom: 0, paddingLeft: 18 }}>
                  <li>
                    Ensure variables are defined in your .env (or environment) with
                    REACT_APP_ prefix and restart the dev server after changes.
                  </li>
                  <li>
                    Verify that{' '}
                    <span style={mono}>REACT_APP_SUPABASE_URL</span> is your
                    project&apos;s URL and{' '}
                    <span style={mono}>REACT_APP_SUPABASE_ANON_KEY</span> is the
                    public anon key (never use service role in frontend).
                  </li>
                  <li>
                    In production builds, set these in the hosting environment before
                    build; create-react-app inlines them at build time.
                  </li>
                </ul>
              </div>
            </div>
          )}
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
