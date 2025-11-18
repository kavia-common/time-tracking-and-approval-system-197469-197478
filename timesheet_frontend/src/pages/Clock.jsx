import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';

// PUBLIC_INTERFACE
export default function Clock() {
  /**
   * Minimal clock stub. Future work: start/stop, lunch break, auto-fill day entry.
   */
  const [now, setNow] = useState(dayjs());

  useEffect(() => {
    const id = setInterval(() => setNow(dayjs()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div>
      <h2 style={{ margin: 0 }}>Clock</h2>
      <div style={{ color: 'var(--text-secondary)', marginBottom: 12 }}>
        Real-time clock and simple work session tracking (stub).
      </div>
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 36, fontWeight: 700 }}>{now.format('HH:mm:ss')}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button type="button" className="theme-toggle" disabled>Start</button>
          <button type="button" className="theme-toggle" disabled>Stop</button>
          <button type="button" className="theme-toggle" disabled>Save to Today</button>
        </div>
      </div>
      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
        Implementation of clock logs and persistence will be handled in a subsequent step.
      </div>
    </div>
  );
}
