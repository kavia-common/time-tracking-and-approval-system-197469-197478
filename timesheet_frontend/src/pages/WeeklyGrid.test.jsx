import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import WeeklyGrid from './WeeklyGrid';
import { AuthContext } from '../lib/authContext';

// Helper to render WeeklyGrid with auth context
function renderWeekly({ user = { id: 'u1', email: 'alice@example.com' }, role = 'employee', loading = false } = {}) {
  const authValue = { user, role, loading, signIn: jest.fn(), signOut: jest.fn() };
  return render(
    <MemoryRouter initialEntries={['/timesheet']}>
      <AuthContext.Provider value={authValue}>
        <WeeklyGrid />
      </AuthContext.Provider>
    </MemoryRouter>
  );
}

describe('WeeklyGrid basics', () => {
  test('renders header, day cards and week total footer', () => {
    renderWeekly();
    expect(screen.getByRole('heading', { name: /weekly timesheet/i })).toBeInTheDocument();
    // There should be controls like Export CSV and Validate
    expect(screen.getByRole('button', { name: /export csv/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /validate/i })).toBeInTheDocument();
    // Footer shows "Week Total"
    expect(screen.getByText(/week total:/i)).toBeInTheDocument();
  });

  test('can add an entry row for a day and shows table-like fields', () => {
    renderWeekly();
    // Find first "+ Add Entry" button (for Monday card typically)
    const addButtons = screen.getAllByRole('button', { name: /\+ add entry/i });
    expect(addButtons.length).toBeGreaterThan(0);

    fireEvent.click(addButtons[0]);

    // Should render inputs for Project, Task, Hours, Notes, Remove button
    expect(screen.getAllByRole('combobox', { name: /project/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('combobox', { name: /task category/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('spinbutton', { name: /hours/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('textbox', { name: /notes/i })[0]).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: /remove entry/i })[0]).toBeInTheDocument();
  });

  test('per-day and week totals reflect entry hours', () => {
    renderWeekly();
    const addButtons = screen.getAllByRole('button', { name: /\+ add entry/i });
    fireEvent.click(addButtons[0]);

    // Enter 2 hours in the first Hours input
    const hoursInput = screen.getAllByRole('spinbutton', { name: /hours/i })[0];
    fireEvent.change(hoursInput, { target: { value: '2' } });

    // The UI shows "Total: Xh" in the card header; check that "Total: 2.00h" appears
    expect(screen.getByText(/total:\s*2\.00h/i)).toBeInTheDocument();

    // And week total footer reflects the same (may include decimals)
    expect(screen.getByText(/week total:\s*2\.00h/i)).toBeInTheDocument();
  });
});
