import React, { useEffect, useState } from 'react';
import { apiFetch } from '../../lib/apiClient';

// PUBLIC_INTERFACE
export default function ProjectsTasks() {
  /** Admin: Manage projects and tasks (stub). */
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function load() {
      await new Promise((r) => setTimeout(r, 200));
      setProjects([
        { id: 'chronose', name: 'Chronose' },
        { id: 'internal', name: 'Internal Ops' },
      ]);
      setTasks([
        { id: 'planning', name: 'Planning' },
        { id: 'testing', name: 'Testing' },
        { id: 'meetings', name: 'Meetings/Collab' },
      ]);
    }
    load();
  }, []);

  return (
    <div>
      <h2 style={{ marginTop: 0 }}>Admin — Projects & Tasks</h2>
      <section className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <h3>Projects</h3>
          <ul>
            {projects.map((p) => (
              <li key={p.id}>{p.name}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Tasks</h3>
          <ul>
            {tasks.map((t) => (
              <li key={t.id}>{t.name}</li>
            ))}
          </ul>
        </div>
      </section>
      <div style={{ marginTop: 12, fontSize: 12, color: 'var(--text-secondary)' }}>
        Note: Add CRUD, validation, and usage impact checks later.
      </div>
    </div>
  );
}
