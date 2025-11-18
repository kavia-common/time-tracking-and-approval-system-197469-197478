import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/apiClient';

// PUBLIC_INTERFACE
export default function UsersRoles() {
  /** Admin: Manage users and roles (stub). */
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      await new Promise((r) => setTimeout(r, 200));
      setRows([
        { email: 'alice@example.com', role: 'employee' },
        { email: 'bob@example.com', role: 'manager' },
        { email: 'carol@example.com', role: 'hr' },
      ]);
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Admin — Users & Roles</h2>
      <section className="container">
        {loading ? (
          <div>Loading…</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '8px 6px' }}>Email</th>
                <th style={{ padding: '8px 6px' }}>Role</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.email} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px 6px' }}>{r.email}</td>
                  <td style={{ padding: '8px 6px' }}>{r.role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
        Note: Hook CRUD to backend; add pagination, filters, and role editing later.
      </div>
    </div>
  );
}
