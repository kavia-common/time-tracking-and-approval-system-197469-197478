import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { apiFetch } from '../lib/apiClient';

// PUBLIC_INTERFACE
export default function HRAttendance() {
  /**
   * HR attendance and absence overview stub.
   * Shows simple attendance summary for the chosen week.
   */
  const [weekStart, setWeekStart] = useState(dayjs().isoWeekday(1).startOf('day'));
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    async function load() {
      setLoading(true);
      // Placeholder: replace with apiFetch('/hr/attendance?week=YYYY-[W]ww')
      await new Promise((r) => setTimeout(r, 250));
      setRows([
        { user: 'alice@example.com', daysWorked: 5, absences: 0, hours: 40 },
        { user: 'bob@example.com', daysWorked: 4, absences: 1, hours: 32 },
        { user: 'carol@example.com', daysWorked: 5, absences: 0, hours: 41.25 },
      ]);
      setLoading(false);
    }
    load();
  }, [weekStart]);

  const changeWeek = (delta) => setWeekStart((w) => w.add(delta, 'week'));

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <h2 style={{ margin: 0 }}>Attendance Overview</h2>
          <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Week {weekStart.format('YYYY-[W]ww')}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="theme-toggle" onClick={() => changeWeek(-1)}>← Prev</button>
          <button className="theme-toggle" onClick={() => setWeekStart(dayjs().isoWeekday(1).startOf('day'))}>This Week</button>
          <button className="theme-toggle" onClick={() => changeWeek(1)}>Next →</button>
        </div>
      </header>

      <section className="container">
        {loading ? (
          <div>Loading…</div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                <th style={{ padding: '8px 6px' }}>User</th>
                <th style={{ padding: '8px 6px' }}>Days Worked</th>
                <th style={{ padding: '8px 6px' }}>Absences</th>
                <th style={{ padding: '8px 6px' }}>Hours</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={i} style={{ borderBottom: '1px solid var(--border-color)' }}>
                  <td style={{ padding: '8px 6px' }}>{r.user}</td>
                  <td style={{ padding: '8px 6px' }}>{r.daysWorked}</td>
                  <td style={{ padding: '8px 6px' }}>{r.absences}</td>
                  <td style={{ padding: '8px 6px' }}>{r.hours.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
        Note: Data is stubbed. Wire to backend reporting endpoints in later implementation.
      </div>
    </div>
  );
}
