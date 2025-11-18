import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/apiClient';

// PUBLIC_INTERFACE
export default function AuditLogs() {
  /** Admin: Audit log viewer (stub). */
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 200));
      setRows([
        { ts: new Date().toISOString(), actor: 'admin@example.com', action: 'OVERRIDE_UNLOCK', target: 'timesheet:alice:2025-W46' },
        { ts: new Date().toISOString(), actor: 'manager@example.com', action: 'APPROVE', target: 'submission:bob:2025-W45' },
      ]);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Admin — Audit Logs</h2>
      <section className="container">
        {loading ? (
          <div>Loading…</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '8px 6px' }}>Timestamp</th>
                <th style={{ padding: '8px 6px' }}>Actor</th>
                <th style={{ padding: '8px 6px' }}>Action</th>
                <th style={{ padding: '8px 6px' }}>Target</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px 6px' }}>{r.ts}</td>
                  <td style={{ padding: '8px 6px' }}>{r.actor}</td>
                  <td style={{ padding: '8px 6px' }}>{r.action}</td>
                  <td style={{ padding: '8px 6px' }}>{r.target}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
        Note: Add pagination, filters, and secure server-side querying later.
      </div>
    </div>
  );
}
