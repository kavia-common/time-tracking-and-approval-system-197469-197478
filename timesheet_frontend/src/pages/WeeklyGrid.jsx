import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../lib/authContext';
import { TASK_CATEGORIES, PROJECTS, ABSENCE_TYPES } from '../constants/catalogs';
import { calcTotals, formatDay, getWeekDays, getWeekStart, loadDraft, saveDraft, toISODate, validateWeek } from '../utils/time';
import { toCSV, downloadCSV } from '../utils/csv';
import dayjs from 'dayjs';

// Row component for a single entry
function EntryRow({ value, onChange, onRemove }) {
  const handle = (key) => (e) => {
    const v = key === 'hours' ? Number(e.target.value) : e.target.value;
    onChange({ ...value, [key]: v });
  };
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 0.6fr 1fr auto', gap: 8, marginBottom: 6 }}>
      <select value={value.projectId || ''} onChange={handle('projectId')} aria-label="Project" style={selectStyle}>
        <option value="">Select project</option>
        {PROJECTS.map((p) => (
          <option key={p.id} value={p.id}>{p.name}</option>
        ))}
      </select>
      <select value={value.taskId || ''} onChange={handle('taskId')} aria-label="Task category" style={selectStyle}>
        <option value="">Select task</option>
        {TASK_CATEGORIES.map((t) => (
          <option key={t.id} value={t.id}>{t.name}</option>
        ))}
      </select>
      <input
        type="number"
        min="0"
        step="0.25"
        value={value.hours ?? ''}
        onChange={handle('hours')}
        aria-label="Hours"
        style={inputStyle}
        placeholder="0.00"
      />
      <input
        type="text"
        value={value.notes || ''}
        onChange={handle('notes')}
        aria-label="Notes"
        style={inputStyle}
        placeholder="Notes (optional)"
      />
      <button type="button" className="theme-toggle" onClick={onRemove} aria-label="Remove entry">Remove</button>
    </div>
  );
}

const dayCardStyle = {
  border: '1px solid var(--border-color)',
  borderRadius: 8,
  padding: 12,
  background: 'var(--bg-secondary)',
};

const selectStyle = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: 6,
  border: '1px solid var(--border-color)',
  background: 'transparent',
};

const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: 6,
  border: '1px solid var(--border-color)',
  background: 'transparent',
};

// PUBLIC_INTERFACE
export default function WeeklyGrid() {
  /**
   * Weekly timesheet entry grid with:
   * - localStorage draft autosave
   * - per-day entries (project, task, hours, notes)
   * - per-day absence
   * - totals and validations
   * - copy previous day utility
   * - CSV export
   */
  const { user } = useAuth();
  const userId = user?.id || 'anon';

  const [weekStart, setWeekStart] = useState(getWeekStart(new Date()).toDate());
  const days = useMemo(() => getWeekDays(weekStart), [weekStart]);

  const [entriesByDay, setEntriesByDay] = useState({});
  const [absencesByDay, setAbsencesByDay] = useState({});
  const [issues, setIssues] = useState([]);
  const [lastSavedTs, setLastSavedTs] = useState(null);

  // load draft on mount and when week changes
  useEffect(() => {
    const draft = loadDraft(weekStart, userId);
    setEntriesByDay(draft.entriesByDay || {});
    setAbsencesByDay(draft.absencesByDay || {});
    setIssues([]);
  }, [weekStart, userId]);

  // autosave on changes (debounced)
  useEffect(() => {
    const id = setTimeout(() => {
      saveDraft(weekStart, userId, { entriesByDay, absencesByDay, meta: { updatedAt: Date.now() } });
      setLastSavedTs(Date.now());
    }, 500);
    return () => clearTimeout(id);
  }, [entriesByDay, absencesByDay, weekStart, userId]);

  const { perDay, weekTotal } = useMemo(() => calcTotals(entriesByDay), [entriesByDay]);

  // handlers
  const addEntry = (dateISO) => {
    setEntriesByDay((prev) => {
      const arr = prev[dateISO] || [];
      return { ...prev, [dateISO]: [...arr, { projectId: '', taskId: '', hours: 0, notes: '' }] };
    });
  };
  const updateEntry = (dateISO, idx, value) => {
    setEntriesByDay((prev) => {
      const arr = [...(prev[dateISO] || [])];
      arr[idx] = value;
      return { ...prev, [dateISO]: arr };
    });
  };
  const removeEntry = (dateISO, idx) => {
    setEntriesByDay((prev) => {
      const arr = [...(prev[dateISO] || [])];
      arr.splice(idx, 1);
      return { ...prev, [dateISO]: arr };
    });
  };
  const setAbsence = (dateISO, type) => {
    setAbsencesByDay((prev) => ({ ...prev, [dateISO]: type }));
  };

  const copyPreviousDay = (dateISO) => {
    const day = dayjs(dateISO);
    const prevDateISO = day.subtract(1, 'day').format('YYYY-MM-DD');
    const prevRows = entriesByDay[prevDateISO] || [];
    const clone = prevRows.map((r) => ({ ...r }));
    setEntriesByDay((prev) => ({ ...prev, [dateISO]: clone }));
    setAbsencesByDay((prev) => ({ ...prev, [dateISO]: absencesByDay[prevDateISO] || 'none' }));
  };

  const runValidation = () => {
    const v = validateWeek(entriesByDay);
    setIssues(v.issues);
  };

  const changeWeekBy = (delta) => {
    setWeekStart((prev) => dayjs(prev).add(delta, 'week').toDate());
  };

  const onExportCSV = () => {
    const headers = ['Date', 'Absence', 'Project', 'Task', 'Hours', 'Notes'];
    const rows = [];
    days.forEach((d) => {
      const iso = toISODate(d);
      const abs = absencesByDay[iso] || 'none';
      const rowsForDay = entriesByDay[iso] || [];
      if (rowsForDay.length === 0) {
        rows.push([iso, abs, '', '', '', '']);
      } else {
        rowsForDay.forEach((r) => {
          rows.push([iso, abs, r.projectId, r.taskId, r.hours, r.notes || '']);
        });
      }
    });
    const csv = toCSV(headers, rows);
    downloadCSV(`timesheet_${dayjs(weekStart).format('YYYY-[W]ww')}.csv`, csv);
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <h2 style={{ margin: 0 }}>Weekly Timesheet</h2>
          <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Week of {dayjs(weekStart).format('DD MMM YYYY')}
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="theme-toggle" onClick={() => changeWeekBy(-1)} aria-label="Previous week">← Prev</button>
          <button type="button" className="theme-toggle" onClick={() => setWeekStart(getWeekStart(new Date()).toDate())}>This Week</button>
          <button type="button" className="theme-toggle" onClick={() => changeWeekBy(1)} aria-label="Next week">Next →</button>
          <button type="button" className="theme-toggle" onClick={onExportCSV}>Export CSV</button>
        </div>
      </header>

      {issues.length > 0 && (
        <div style={{ border: '1px solid var(--error)', color: 'var(--error)', padding: 10, borderRadius: 6, marginBottom: 12 }}>
          <strong>Validation issues:</strong>
          <ul>
            {issues.map((m, i) => <li key={i}>{m}</li>)}
          </ul>
        </div>
      )}

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
        {days.map((d) => {
          const label = formatDay(d);
          const iso = toISODate(d);
          const dayRows = entriesByDay[iso] || [];
          const dayAbs = absencesByDay[iso] || 'none';
          const total = perDay[iso] || 0;
          return (
            <div key={iso} style={dayCardStyle}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <div>
                  <strong>{label}</strong>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{iso}</div>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Total: {total.toFixed(2)}h</div>
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                <label style={{ flex: 1 }}>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Absence</div>
                  <select aria-label="Absence" style={selectStyle} value={dayAbs} onChange={(e) => setAbsence(iso, e.target.value)}>
                    {ABSENCE_TYPES.map((a) => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </label>
                <button type="button" className="theme-toggle" onClick={() => copyPreviousDay(iso)} aria-label="Copy previous day">
                  Copy Prev
                </button>
              </div>

              {dayRows.length > 0 && (
                <div style={{ marginBottom: 6, fontSize: 12, color: 'var(--text-secondary)' }}>
                  Entries
                </div>
              )}
              {dayRows.map((row, idx) => (
                <EntryRow
                  key={idx}
                  value={row}
                  onChange={(v) => updateEntry(iso, idx, v)}
                  onRemove={() => removeEntry(iso, idx)}
                />
              ))}
              <button type="button" className="theme-toggle" onClick={() => addEntry(iso)}>+ Add Entry</button>
            </div>
          );
        })}
      </section>

      <footer style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ color: 'var(--text-secondary)' }}>
          Week Total: <strong>{weekTotal.toFixed(2)}h</strong>
          {lastSavedTs && <span style={{ marginLeft: 8, fontSize: 12 }}>Auto-saved {dayjs(lastSavedTs).format('HH:mm:ss')}</span>}
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="theme-toggle" onClick={runValidation}>Validate</button>
        </div>
      </footer>
    </div>
  );
}
