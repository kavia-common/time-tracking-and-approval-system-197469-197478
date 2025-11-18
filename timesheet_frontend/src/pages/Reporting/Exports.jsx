import React, { useState } from 'react';
import dayjs from 'dayjs';
import { apiFetch } from '../../lib/apiClient';
import { toCSV, downloadCSV } from '../../utils/csv';

// PUBLIC_INTERFACE
export default function Exports() {
  /**
   * Reporting exports stub.
   * Allows selecting a range and exporting a CSV with placeholder data.
   */
  const [period, setPeriod] = useState('week'); // week | month
  const [when, setWhen] = useState(dayjs().format('YYYY-[W]ww')); // simple token for now
  const [exporting, setExporting] = useState(false);

  const onExport = async () => {
    setExporting(true);
    // Placeholder dataset; in future call: await apiFetch(`/reports/exports?period=${period}&when=${when}`);
    await new Promise((r) => setTimeout(r, 250));
    const headers = ['User', 'Date', 'Project', 'Task', 'Hours', 'Absence', 'Notes'];
    const rows = [
      ['alice@example.com', dayjs().format('YYYY-MM-DD'), 'chronose', 'project', 8, 'none', 'Initial implementation'],
      ['bob@example.com', dayjs().format('YYYY-MM-DD'), 'internal', 'meetings', 6.5, 'none', 'Sprint planning'],
    ];
    const csv = toCSV(headers, rows);
    downloadCSV(`export_${period}_${when}.csv`, csv);
    setExporting(false);
  };

  return (
    <div>
      <header style={{ marginBottom: 12 }}>
        <h2 style={{ margin: 0 }}>Reporting — Exports</h2>
        <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
          Export CSV/Excel compatible datasets for payroll and delivery.
        </div>
      </header>

      <section className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, alignItems: 'end' }}>
        <label>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Period</div>
          <select value={period} onChange={(e) => setPeriod(e.target.value)} style={selectStyle}>
            <option value="week">Week</option>
            <option value="month">Month</option>
          </select>
        </label>
        <label>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>When</div>
          <input
            type="text"
            value={when}
            onChange={(e) => setWhen(e.target.value)}
            placeholder={period === 'week' ? 'YYYY-Www' : 'YYYY-MM'}
            style={inputStyle}
          />
        </label>
        <button className="theme-toggle" onClick={onExport} disabled={exporting}>
          {exporting ? 'Exporting…' : 'Export CSV'}
        </button>
      </section>

      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
        Note: The data is stubbed. Integrate filters and real datasets later.
      </div>
    </div>
  );
}

const selectStyle = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: 6,
  border: '1px solid var(--border-color)',
  background: 'transparent',
};
const inputStyle = { ...selectStyle };
