import React, { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../lib/authContext';
import { apiFetch } from '../lib/apiClient';
import { getWeekStart, loadDraft, toISODate, getWeekDays } from '../utils/time';
import dayjs from 'dayjs';

// simple state machine states
const STATES = ['draft', 'submitted', 'approved', 'needs_changes'];

// Stub API calls
async function apiSubmitWeek({ userId, weekKey, payload }) {
  // Stub: In future, POST /timesheets/submit
  // Here we simulate success
  return { ok: true, status: 200, data: { state: 'submitted', weekKey } };
}
async function apiGetWeekStatus({ userId, weekKey }) {
  // Stub: In future, GET /timesheets/status
  // Simulate 'draft' if nothing else persisted
  return { ok: true, status: 200, data: { state: 'draft' } };
}
async function apiRecallSubmission({ userId, weekKey }) {
  // Stub: recall to draft
  return { ok: true, status: 200, data: { state: 'draft' } };
}

// PUBLIC_INTERFACE
export default function SubmitWeek() {
  /**
   * Allows user to submit their weekly timesheet.
   * Client-only state machine with fake API calls which can later be wired to backend.
   * States: draft -> submitted -> approved | needs_changes
   */
  const { user } = useAuth();
  const userId = user?.id || 'anon';

  const [weekStart, setWeekStart] = useState(getWeekStart(new Date()).toDate());
  const weekKey = useMemo(() => dayjs(weekStart).format('YYYY-[W]ww'), [weekStart]);
  const days = useMemo(() => getWeekDays(weekStart), [weekStart]);

  const [state, setState] = useState('draft');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  async function refresh() {
    setLoading(true);
    const res = await apiGetWeekStatus({ userId, weekKey });
    if (res.ok) {
      setState(res.data?.state || 'draft');
    }
    setLoading(false);
  }

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, weekKey]);

  const draft = loadDraft(weekStart, userId);
  const hasAnyHours = useMemo(() => {
    const entries = draft.entriesByDay || {};
    return Object.values(entries).some((rows) => (rows || []).some((r) => Number(r.hours || 0) > 0));
  }, [draft]);

  const submit = async () => {
    setLoading(true);
    setMessage('');
    const res = await apiSubmitWeek({ userId, weekKey, payload: draft });
    if (res.ok) {
      setState('submitted');
      setMessage('Submitted successfully.');
    } else {
      setMessage('Submit failed.');
    }
    setLoading(false);
  };

  const recall = async () => {
    setLoading(true);
    setMessage('');
    const res = await apiRecallSubmission({ userId, weekKey });
    if (res.ok) {
      setState('draft');
      setMessage('Moved back to draft.');
    } else {
      setMessage('Recall failed.');
    }
    setLoading(false);
  };

  return (
    <div>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div>
          <h2 style={{ margin: 0 }}>Submit Week</h2>
          <div style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Week of {dayjs(weekStart).format('DD MMM YYYY')} ({weekKey})
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="theme-toggle" onClick={() => setWeekStart(dayjs(weekStart).subtract(1, 'week').toDate())}>← Prev</button>
          <button type="button" className="theme-toggle" onClick={() => setWeekStart(getWeekStart(new Date()).toDate())}>This Week</button>
          <button type="button" className="theme-toggle" onClick={() => setWeekStart(dayjs(weekStart).add(1, 'week').toDate())}>Next →</button>
        </div>
      </header>

      <div className="container" style={{ marginBottom: 12 }}>
        <div style={{ marginBottom: 6 }}>
          <strong>Status:</strong> <span style={{ textTransform: 'capitalize' }}>{state}</span>
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
          Summary by day:
        </div>
        <ul style={{ marginTop: 6 }}>
          {days.map((d) => {
            const iso = toISODate(d);
            const rows = draft.entriesByDay?.[iso] || [];
            const sum = rows.reduce((acc, r) => acc + Number(r.hours || 0), 0);
            const abs = draft.absencesByDay?.[iso] || 'none';
            return (
              <li key={iso} style={{ fontSize: 14 }}>
                {iso}: {sum.toFixed(2)}h {abs !== 'none' ? `(Absence: ${abs})` : ''}
              </li>
            );
          })}
        </ul>
      </div>

      {message && (
        <div style={{ marginBottom: 12, color: 'var(--success)' }}>{message}</div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        {state === 'draft' && (
          <button
            type="button"
            className="theme-toggle"
            onClick={submit}
            disabled={loading || !hasAnyHours}
            title={!hasAnyHours ? 'Add at least one entry with hours before submitting' : 'Submit week'}
          >
            {loading ? 'Submitting…' : 'Submit Week'}
          </button>
        )}
        {state === 'submitted' && (
          <button
            type="button"
            className="theme-toggle"
            onClick={recall}
            disabled={loading}
          >
            {loading ? 'Recalling…' : 'Recall to Draft'}
          </button>
        )}
        {state === 'approved' && (
          <button type="button" className="theme-toggle" disabled>
            Approved (Locked)
          </button>
        )}
        {state === 'needs_changes' && (
          <button type="button" className="theme-toggle" onClick={recall} disabled={loading}>
            {loading ? 'Updating…' : 'Move to Draft'}
          </button>
        )}
      </div>

      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
        Note: This page uses stubbed API calls. Hook these to backend endpoints in a later step.
      </div>
    </div>
  );
}
