import React, { useState } from 'react';
import dayjs from 'dayjs';
import { toCSV, downloadCSV } from '../../utils/csv';
import { getSupabase } from '../../lib/supabaseClient';

// PUBLIC_INTERFACE
export default function Exports() {
  /**
   * Reporting exports stub.
   * Allows selecting a range and exporting a CSV with placeholder data.
   */
  const [period, setPeriod] = useState('week'); // week | month
  const [when, setWhen] = useState(dayjs().format('YYYY-[W]ww')); // simple token for now
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');
  const supabase = getSupabase();

  const onExport = async () => {
    setExporting(true);
    setError('');
    try {
      let headers = ['User', 'Date', 'Project', 'Task', 'Hours', 'Absence', 'Notes'];
      let rows = [];
      if (supabase) {
        if (period === 'week') {
          const { data, error } = await supabase.rpc('report_export_week', { p_week_key: when });
          if (error) throw error;
          rows = (data || []).map((r) => [
            r.user_email || r.user || '',
            r.date,
            r.project_id || '',
            r.task_id || '',
            Number(r.hours || 0),
            r.absence || 'none',
            r.notes || '',
          ]);
        } else {
          // month expected format YYYY-MM
          const { data, error } = await supabase.rpc('report_export_month', { p_month: when });
          if (error) throw error;
          rows = (data || []).map((r) => [
            r.user_email || r.user || '',
            r.date,
            r.project_id || '',
            r.task_id || '',
            Number(r.hours || 0),
            r.absence || 'none',
            r.notes || '',
          ]);
        }
      } else {
        // Fallback local stub
        rows = [
          ['alice@example.com', dayjs().format('YYYY-MM-DD'), 'chronose', 'project', 8, 'none', 'Initial implementation'],
          ['bob@example.com', dayjs().format('YYYY-MM-DD'), 'internal', 'meetings', 6.5, 'none', 'Sprint planning'],
        ];
      }
      const csv = toCSV(headers, rows);
      downloadCSV(`export_${period}_${when}.csv`, csv);
    } catch (e) {
      setError(String(e?.message || e));
    } finally {
      setExporting(false);
    }
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

      {error && (
        <div style={{ marginTop: 12, color: 'var(--error)' }}>{error}</div>
      )}
      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
        Note: Uses Supabase RPCs when configured; otherwise falls back to sample data.
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
