# Chronose Frontend (React)

Minimal React app with Ocean Professional theme and structured routes for the Chronose MVP.

## Features

- Lightweight, idiomatic React (no heavy UI framework)
- Routing with protected routes and role-gated navigation
- Weekly timesheet grid with autosave and CSV export
- Auth context integrated with Supabase (graceful when env not set)

## Getting Started

Install and run:

- npm install
- npm start (http://localhost:3000)

## Environment Variables

Create a `.env` file in this folder (do not commit secrets). Example `.env.example`:

- REACT_APP_API_BASE=
- REACT_APP_BACKEND_URL=
- REACT_APP_FRONTEND_URL=
- REACT_APP_WS_URL=
- REACT_APP_NODE_ENV=development
- REACT_APP_NEXT_TELEMETRY_DISABLED=true
- REACT_APP_ENABLE_SOURCE_MAPS=true
- REACT_APP_PORT=3000
- REACT_APP_TRUST_PROXY=false
- REACT_APP_LOG_LEVEL=info
- REACT_APP_HEALTHCHECK_PATH=/health
- REACT_APP_FEATURE_FLAGS=experimentalView
- REACT_APP_EXPERIMENTS_ENABLED=false
- REACT_APP_SUPABASE_URL=
- REACT_APP_SUPABASE_ANON_KEY=

Notes:
- If REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are not set, the app still renders; Login shows a notice and auth actions are disabled.
- Feature flags: set REACT_APP_FEATURE_FLAGS as comma-separated keys; enable experimental routes with REACT_APP_EXPERIMENTS_ENABLED=true.

## App Structure and Routes

- Global shell:
  - NavBar: shows app title (Chronose), theme toggle, and auth controls
  - SideNav: visible only when authenticated; includes primary links and admin-only section
- Routes:
  - / → redirects to /dashboard (if authenticated) or /login
  - /login → Login page (Supabase email/password)
  - /dashboard → EmployeeDashboard (protected)
  - /timesheet → WeeklyGrid (protected)
  - /timesheet/submit → SubmitWeek (protected)
  - /clock → Clock (protected)
  - /approvals → ManagerApprovals (protected, requiredRole="manager")
  - /reporting/exports → Exports (protected, requiredRole="hr")
  - /admin/users-roles → UsersRoles (protected, requiredRole="admin")
  - /admin/projects-tasks → ProjectsTasks (protected, requiredRole="admin")
  - /admin/holidays-absences → HolidaysAbsences (protected, requiredRole="admin")
  - /admin/settings → Settings (protected, requiredRole="admin")
  - /admin/audit-logs → AuditLogs (protected, requiredRole="admin")
  - /experimental → Example experimental page (requires REACT_APP_EXPERIMENTS_ENABLED and feature flag)

## Testing

We use React Testing Library via CRA.

- npm test (watch mode)
- CI: run tests once with CI=true npm test

Included tests:
- src/App.test.js — shell elements (NavBar), SideNav visibility, login route rendering, protected route unauthenticated redirect.
- src/pages/WeeklyGrid.test.jsx — renders basics, can add entry rows, totals update.

Ensure setupTests.js includes @testing-library/jest-dom (already configured).

## Build

- npm run build — outputs production bundle in build/

## Styling

- Theme variables in src/App.css (Ocean Professional)
- Layout components in src/components/Layout/
- Follow accessible labels for inputs and navigation for reliable tests and a11y
