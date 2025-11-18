import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useAuth } from '../lib/authContext';
import { getSupabase } from '../lib/supabaseClient';

// PUBLIC_INTERFACE
export default function ManagerApprovals() {
  /**
   * Manager approvals queue stub.
   * Displays pending submissions from team with placeholder actions.
   */
  const { user } = useAuth();
  const supabase = getSupabase();
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;
    async function load() {
      setLoading(true);
      setError('');
      try {
        if (!supabase) {
          // No backend available
          setPending([]);
        } else {
          // Expect a view or RPC for manager queue: manager_pending_approvals(auth_id)
          const { data, error } = await supabase.rpc('manager_pending_approvals', {
            p_manager_auth_id: user?.id || null,
          });
          if (error) throw error;
          // Normalize expected fields: id, employee_email, week_key, total_hours
          const mapped = (data || []).map((r) => ({
            id: r.id,
            employee: r.employee_email || r.user_email || 'unknown',
            week: r.week_key || 'unknown',
            total: Number(r.total_hours || 0),
          }));
          if (active) setPending(mapped);
        }
      } catch (e) {
        if (active) setError(String(e?.message || e));
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => { active = false; };
  }, [supabase, user?.id]);

  const onApprove = async (id) => {
    try {
      if (!supabase) return;
      const { error } = await supabase.rpc('approve_submission', { p_submission_id: id });
      if (error) throw error;
      setPending((list) => list.filter((x) => x.id !== id));
    } catch (e) {
      setError(String(e?.message || e));
    }
  };
  const onRequestChanges = async (id) => {
    try {
      if (!supabase) return;
      const { error } = await supabase.rpc('reject_submission', { p_submission_id: id });
      if (error) throw error;
      setPending((list) => list.filter((x) => x.id !== id));
    } catch (e) {
      setError(String(e?.message || e));
    }
  };

  return (
    <div>
      <header style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Team Approvals</h2>
        <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          You can review and take action on weekly submissions from your team.
        </div>
      </header>

      <section className="container">
        {loading ? (
          <div>Loading…</div>
        ) : error ? (
          <div style={{ color: 'var(--error)' }}>{error}</div>
        ) : pending.length === 0 ? (
          <div style={{ color: 'var(--text-secondary)' }}>No pending submissions.</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '8px 6px' }}>Employee</th>
                <th style={{ padding: '8px 6px' }}>Week</th>
                <th style={{ padding: '8px 6px' }}>Total</th>
                <th style={{ padding: '8px 6px' }}></th>
              </tr>
            </thead>
            <tbody>
              {pending.map((p) => (
                <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px 6px' }}>{p.employee}</td>
                  <td style={{ padding: '8px 6px' }}>{p.week}</td>
                  <td style={{ padding: '8px 6px' }}>{p.total.toFixed(2)} h</td>
                  <td style={{ padding: '8px 6px', display: 'flex', gap: 6 }}>
                    <button className="theme-toggle" onClick={() => onApprove(p.id)}>Approve</button>
                    <button className="theme-toggle" onClick={() => onRequestChanges(p.id)}>Request Changes</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
        Note: Hook actions to backend endpoints in later steps.
      </div>
    </div>
  );
}
