import { Routes, Route, Navigate, Outlet, useNavigate } from 'react-router-dom';
import { LoginPage } from '../auth/LoginPage.tsx';
import { EventsPage } from '../events/EventsPage.tsx';
import { EventDetailsPage } from '../events/EventDetailsPage.tsx';
import { SuppliersPage } from '../suppliers/SuppliersPage.tsx';
import { ContractsPage } from '../contracts/ContractsPage.tsx';
import { useAuthStore } from '../auth/auth.store.ts';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { NotificationsProvider } from '../../shared/notifications.tsx';
import { useMemo, useState, useEffect } from 'react';
import { Layout } from './Layout.tsx';

export function App() {
  const token = useAuthStore((s) => s.token);
  const user = useAuthStore((s) => s.user);
  const [mode, setMode] = useState<'light' | 'dark'>(() => (localStorage.getItem('themeMode') as 'light' | 'dark') || 'light');
  useEffect(() => {
    localStorage.setItem('themeMode', mode);
  }, [mode]);
  const theme = useMemo(() => createTheme({
    palette: { mode, primary: { main: '#6c5ce7' } },
    shape: { borderRadius: 10 },
  }), [mode]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationsProvider>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={token ? <Navigate to={user?.role === 'planner' ? '/events' : '/suppliers'} replace /> : <Navigate to="/login" replace />} />

          <Route element={<RequireAuth><Layout mode={mode} onToggleMode={() => setMode((m) => m === 'light' ? 'dark' : 'light')} /></RequireAuth>}>
            <Route path="/events" element={<EventsPage />} />
            <Route path="/events/:id" element={<EventDetailsPage />} />
            <Route path="/suppliers" element={<SuppliersPage />} />
            <Route path="/contracts" element={<ContractsPage />} />
          </Route>
        </Routes>
      </NotificationsProvider>
    </ThemeProvider>
  );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((s) => s.token);
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}


