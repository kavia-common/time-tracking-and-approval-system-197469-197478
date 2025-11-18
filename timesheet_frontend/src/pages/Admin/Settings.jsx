import React, { useState } from 'react';

// PUBLIC_INTERFACE
export default function Settings() {
  /** Admin: System settings (stub). */
  const [weeklyHourLimit, setWeeklyHourLimit] = useState(80);
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  const onSave = () => {
    // Placeholder: POST settings
    alert('Settings saved (stub)');
  };

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Admin — Settings</h2>
      <section className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <label>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>Weekly Hours Limit</div>
          <input
            type="number"
            value={weeklyHourLimit}
            onChange={(e) => setWeeklyHourLimit(Number(e.target.value))}
            style={inputStyle}
          />
        </label>
        <label style={{ alignSelf: 'end' }}>
          <input
            id="reminders"
            type="checkbox"
            checked={remindersEnabled}
            onChange={(e) => setRemindersEnabled(e.target.checked)}
          />{' '}
          <label htmlFor="reminders">Enable Reminders</label>
        </label>
      </section>
      <div style={{ marginTop: 12 }}>
        <button className="theme-toggle" onClick={onSave}>Save</button>
      </div>
      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
        Note: Persist to backend and apply across system in later steps.
      </div>
    </div>
  );
}

const inputStyle = {
  width: '100%',
  padding: '8px 10px',
  borderRadius: 6,
  border: '1px solid var(--border-color)',
  background: 'transparent',
};
