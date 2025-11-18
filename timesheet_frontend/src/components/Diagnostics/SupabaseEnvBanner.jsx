import React, { useEffect, useMemo, useState } from 'react';
import { featureFlags } from '../../lib/featureFlags';

/**
 * INTERNAL: Safe getter for env variables
 */
function getEnv(name) {
  const v = process.env[name];
  return v && String(v).trim().length > 0 ? String(v).trim() : null;
}

/**
 * INTERNAL: Masks a string by keeping first n and last m characters.
 * If too short, returns asterisks with length preserved.
 */
function maskValue(value, keepStart = 4, keepEnd = 3) {
  if (!value) return '';
  const s = String(value);
  if (s.length <= keepStart + keepEnd) {
    return '*'.repeat(Math.max(4, s.length));
  }
  const start = s.slice(0, keepStart);
  const end = s.slice(-keepEnd);
  return `${start}${'*'.repeat(s.length - keepStart - keepEnd)}${end}`;
}

/**
 * INTERNAL: Determines if the banner should be shown
 * - Show if NODE_ENV !== 'production'
 * - OR if REACT_APP_FEATURE_FLAGS includes 'showSupabaseBanner'
 */
function shouldShowBanner() {
  const nodeEnv = process.env.NODE_ENV;
  const { flags } = featureFlags();
  if (nodeEnv !== 'production') return true;
  return Boolean(flags.showSupabaseBanner);
}

// PUBLIC_INTERFACE
export default function SupabaseEnvBanner() {
  /**
   * A small diagnostics banner that displays masked status of Supabase env vars.
   * It is visible across the app (mounted in App.js) and:
   * - Shows only in non-production environments, unless explicitly enabled using
   *   REACT_APP_FEATURE_FLAGS=showSupabaseBanner.
   * - Is dismissible and remembers state via localStorage ('hideSupabaseBanner').
   * - Never logs or exposes full secrets; anon key is masked client-side.
   */
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    try {
      const v = localStorage.getItem('hideSupabaseBanner');
      setHidden(v === 'true');
    } catch {
      // ignore storage errors
      setHidden(false);
    }
  }, []);

  const visible = useMemo(() => shouldShowBanner() && !hidden, [hidden]);

  const supabaseUrl = getEnv('REACT_APP_SUPABASE_URL');
  const supabaseKey = getEnv('REACT_APP_SUPABASE_ANON_KEY') || getEnv('REACT_APP_SUPABASE_KEY'); // support provided env list note
  const hasUrl = Boolean(supabaseUrl);
  const hasKey = Boolean(supabaseKey);

  const maskedUrl = hasUrl ? `${supabaseUrl.split('//')[0]}//…${supabaseUrl.slice(-8)}` : '';
  const maskedKey = hasKey ? maskValue(supabaseKey) : '';

  const onDismiss = () => {
    try {
      localStorage.setItem('hideSupabaseBanner', 'true');
    } catch {
      // ignore
    }
    setHidden(true);
  };

  if (!visible) return null;

  // Styles: Ocean Professional, subtle border, compact
  const wrapStyle = {
    background: 'var(--bg-secondary)',
    borderBottom: '1px solid var(--border-color)',
    padding: '6px 10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: 12,
    color: 'var(--text-secondary)',
    boxShadow: 'var(--shadow)',
  };
  const pill = (ok) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: '2px 8px',
    borderRadius: 999,
    border: `1px solid ${ok ? 'var(--success)' : 'var(--error)'}`,
    color: ok ? 'var(--success)' : 'var(--error)',
    background: ok ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.08)',
    fontWeight: 600,
  });
  const mono = { fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace', color: 'var(--text-primary)' };
  const btnStyle = {
    background: 'transparent',
    border: '1px solid var(--border-color)',
    color: 'var(--text-secondary)',
    borderRadius: 6,
    padding: '4px 8px',
    cursor: 'pointer',
  };

  return (
    <div role="region" aria-label="Diagnostics banner" style={wrapStyle}>
      <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <strong style={{ color: 'var(--primary)' }}>Diagnostics</strong>
        <span title="Supabase URL present" style={pill(hasUrl)}>{hasUrl ? 'URL ✓' : 'URL ✕'}</span>
        <span title="Supabase anon key present" style={pill(hasKey)}>{hasKey ? 'KEY ✓' : 'KEY ✕'}</span>
        {hasUrl && (
          <span>
            URL: <span style={mono}>{maskedUrl}</span>
          </span>
        )}
        {hasKey && (
          <span>
            ANON KEY: <span style={mono}>{maskedKey}</span>
          </span>
        )}
        {!hasUrl || !hasKey ? (
          <span style={{ color: 'var(--error)' }}>
            Missing env vars — set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY.
          </span>
        ) : (
          <span style={{ color: 'var(--success)' }}>
            Supabase configuration detected.
          </span>
        )}
      </div>
      <div>
        <button type="button" onClick={onDismiss} aria-label="Dismiss diagnostics banner" style={btnStyle}>
          Dismiss
        </button>
      </div>
    </div>
  );
}
