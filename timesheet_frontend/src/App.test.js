import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { AuthContext } from './lib/authContext';

function renderWithAuth(ui, { user = null, role = null, loading = false, initialEntries = ['/'] } = {}) {
  const authValue = {
    user,
    role,
    loading,
    signIn: jest.fn(),
    signOut: jest.fn(),
  };
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthContext.Provider value={authValue}>{ui}</AuthContext.Provider>
    </MemoryRouter>
  );
}

describe('App routing shell', () => {
  test('NavBar shows app title always', () => {
    renderWithAuth(<App />, { user: null, initialEntries: ['/login'] });
    expect(screen.getByRole('link', { name: /chronose home/i })).toBeInTheDocument();
    expect(screen.getByText(/chronose/i)).toBeInTheDocument();
  });

  test('SideNav is hidden when unauthenticated and visible when authenticated', () => {
    // unauthenticated: no sidenav
    renderWithAuth(<App />, { user: null, initialEntries: ['/login'] });
    expect(screen.queryByRole('navigation', { name: /primary/i })).not.toBeInTheDocument();

    // authenticated: sidenav appears
    renderWithAuth(<App />, { user: { id: 'u1', email: 'a@example.com' }, role: 'employee', initialEntries: ['/dashboard'] });
    expect(screen.getByRole('navigation', { name: /primary/i })).toBeInTheDocument();
    // basic links
    expect(screen.getByRole('link', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /timesheet/i })).toBeInTheDocument();
  });

  test('Login route renders when visiting /login', () => {
    renderWithAuth(<App />, { user: null, initialEntries: ['/login'] });
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
  });

  test('ProtectedRoute redirects unauthenticated users to /login', () => {
    renderWithAuth(<App />, { user: null, initialEntries: ['/dashboard'] });
    // When unauthenticated trying to access protected route, Login should be visible
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument();
  });
});
