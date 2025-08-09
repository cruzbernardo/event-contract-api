import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from './auth.store.ts';
import { api } from '../../shared/api.ts';
import { Box, Button, Container, Paper, Stack, TextField, Typography } from '@mui/material';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const setAuth = useAuthStore((s) => s.setAuth);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const { data } = await api.post('/authentication/sign-in', { email, password });
      const me = await api.get('/authentication/me', {
        headers: { Authorization: `Bearer ${data.accessToken}` },
      });
      setAuth(data.accessToken, me.data);
      navigate('/events');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Erro ao autenticar');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 12 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>Entrar</Typography>
        <Box component="form" onSubmit={onSubmit}>
          <Stack spacing={2}>
            <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
            <TextField label="Senha" value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
            {error && <Typography color="error">{error}</Typography>}
            <Button variant="contained" type="submit" disabled={loading}>{loading ? 'Entrando...' : 'Entrar'}</Button>
          </Stack>
        </Box>
      </Paper>
    </Container>
  );
}


