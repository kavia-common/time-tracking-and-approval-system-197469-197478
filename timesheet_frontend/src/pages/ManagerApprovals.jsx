import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useAuth } from '../lib/authContext';
import { apiFetch } from '../lib/apiClient';

// PUBLIC_INTERFACE
export default function ManagerApprovals() {
  /**
   * Manager approvals queue stub.
   * Displays pending submissions from team with placeholder actions.
   */
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [pending, setPending] = useState([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      // Placeholder: replace with apiFetch('/manager/approvals')
      await new Promise((r) => setTimeout(r, 250));
      setPending([
        { id: 'subm_1', employee: 'alice@example.com', week: dayjs().subtract(1, 'week').format('YYYY-[W]ww'), total: 38.5 },
        { id: 'subm_2', employee: 'bob@example.com', week: dayjs().subtract(1, 'week').format('YYYY-[W]ww'), total: 42.0 },
      ]);
      setLoading(false);
    }
    load();
  }, []);

  const onApprove = (id) => {
    // Placeholder action
    setPending((list) => list.filter((x) => x.id !== id));
  };
  const onRequestChanges = (id) => {
    // Placeholder action
    setPending((list) => list.filter((x) => x.id !== id));
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
