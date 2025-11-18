import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useAuth } from '../lib/authContext';
import { apiFetch } from '../lib/apiClient';

// PUBLIC_INTERFACE
export default function EmployeeDashboard() {
  /**
   * Employee dashboard stub showing recent activity and submission status.
   * Uses apiClient stubs for placeholders and follows Ocean Professional theme.
   */
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState({
    currentWeek: dayjs().isoWeek(),
    weekTotal: 0,
    lastSubmittedWeek: null,
    status: 'draft',
  });

  useEffect(() => {
    async function load() {
      setLoading(true);
      // Placeholder: simulate fetching dashboard summary
      // Replace with apiFetch('/employee/summary') later
      await new Promise((r) => setTimeout(r, 250));
      setSummary((s) => ({
        ...s,
        weekTotal: 24.5,
        lastSubmittedWeek: dayjs().subtract(1, 'week').format('YYYY-[W]ww'),
        status: 'draft',
      }));
      setLoading(false);
    }
    load();
  }, []);

  return (
    <div>
      <header style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>My Dashboard</h2>
        <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          Welcome{user?.email ? `, ${user.email}` : ''}. Current week: {dayjs().format('YYYY-[W]ww')}.
        </div>
      </header>

      <section className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
        <StatCard label="This Week Total" value={`${summary.weekTotal.toFixed(2)} h`} />
        <StatCard label="Last Submitted" value={summary.lastSubmittedWeek || '—'} />
        <StatCard label="Status" value={summary.status} />
      </section>

      <section style={{ marginTop: 16 }} className="container">
        <h3 style={{ marginTop: 0 }}>Recent Activity</h3>
        {loading ? (
          <div>Loading…</div>
        ) : (
          <ul style={{ marginTop: 8 }}>
            <li>Edited Tuesday entries (Project Work) — 2.5h</li>
            <li>Added absence (WFH) on Wednesday</li>
            <li>Exported CSV for last week</li>
          </ul>
        )}
      </section>

      <section style={{ marginTop: 16, display: 'flex', gap: 8 }}>
        <a className="theme-toggle" href="/timesheet">Go to Timesheet</a>
        <a className="theme-toggle" href="/timesheet/submit">Submit Week</a>
      </section>
    </div>
  );
}

function StatCard({ label, value }) {
  return (
    <div style={{ border: '1px solid var(--border-color)', borderRadius: 8, padding: 12, background: 'var(--bg-secondary)' }}>
      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</div>
      <div style={{ fontWeight: 700, fontSize: 18 }}>{value}</div>
    </div>
  );
}
