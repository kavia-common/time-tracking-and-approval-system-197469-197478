import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/apiClient';

// PUBLIC_INTERFACE
export default function HolidaysAbsences() {
  /** Admin: Manage holiday calendar and absence types (stub). */
  const [holidays, setHolidays] = useState([]);
  const [absenceTypes, setAbsenceTypes] = useState([]);

  useEffect(() => {
    async function load() {
      await new Promise((r) => setTimeout(r, 200));
      setHolidays([
        { date: '2025-01-01', name: 'New Year' },
        { date: '2025-01-26', name: 'Republic Day' },
      ]);
      setAbsenceTypes([
        { id: 'sick', name: 'Sick' },
        { id: 'vacation', name: 'Vacation' },
        { id: 'wfh', name: 'WFH (No Hours)' },
      ]);
    }
    load();
  }, []);

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Admin — Holidays & Absences</h2>
      <section className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <h3>Holidays</h3>
          <ul>
            {holidays.map((h) => (
              <li key={h.date}>{h.date} — {h.name}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Absence Types</h3>
          <ul>
            {absenceTypes.map((a) => (
              <li key={a.id}>{a.name}</li>
            ))}
          </ul>
        </div>
      </section>
      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
        Note: Implement CRUD and propagation to entry UI later.
      </div>
    </div>
  );
}
