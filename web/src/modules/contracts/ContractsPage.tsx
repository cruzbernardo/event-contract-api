import { useEffect, useState } from 'react';
import { api } from '../../shared/api.ts';
import { Box, Button, Container, Paper, Stack, TextField, Typography, Alert, MenuItem } from '@mui/material';
import { useAuthStore } from '../auth/auth.store';
import { useNotify } from '../../shared/notifications';

export function ContractsPage() {
  const [events, setEvents] = useState<Array<{ id: string; name: string }>>([]);
  const [selectedEventId, setSelectedEventId] = useState('');
  const [eventSuppliers, setEventSuppliers] = useState<Array<{ eventSupplierId: string; name?: string }>>([]);
  const [eventSupplierId, setEventSupplierId] = useState('');
  const [status, setStatus] = useState<'pending' | 'signed' | 'cancelled'>('pending');
  const [depositAmount, setDepositAmount] = useState<number | undefined>();
  const [dueDate, setDueDate] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((s) => s.user);
  const notify = useNotify();

  useEffect(() => {
    (async () => {
      if (user?.role !== 'planner') return;
      try {
        const { data } = await api.get('/events');
        setEvents((data || []).map((e: any) => ({ id: e.id, name: e.name })));
      } catch {}
    })();
  }, [user?.role]);

  useEffect(() => {
    (async () => {
      if (!selectedEventId) {
        setEventSuppliers([]);
        setEventSupplierId('');
        return;
      }
      try {
        const { data } = await api.get(`/events/${selectedEventId}`);
        setEventSuppliers((data?.suppliers || []).map((s: any) => ({ eventSupplierId: s.eventSupplierId, name: s.name })));
      } catch {}
    })();
  }, [selectedEventId]);

  async function createContract(e: React.FormEvent) {
    e.preventDefault();
    try {
      setError(null);
      if (!eventSupplierId) {
        notify('Selecione um fornecedor atrelado ao evento', 'warning');
        return;
      }
      await api.post('/contracts', {
        eventSupplierId,
        status,
        depositAmount,
        dueDate: dueDate ? new Date(dueDate) : undefined,
        notes: notes || undefined,
      });
      setEventSupplierId('');
      setStatus('pending');
      setDepositAmount(undefined);
      setDueDate('');
      setNotes('');
      notify('Contrato criado com sucesso', 'success');
    } catch (err: any) {
      setError(err?.response?.data?.message?.[0] || err?.response?.data?.message || 'Falha ao criar contrato');
    }
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>Contratos</Typography>
      {user?.role === 'planner' && (
        <Paper sx={{ p: 2 }}>
          <Box component="form" onSubmit={createContract}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
              <TextField select label="Evento" value={selectedEventId} onChange={(e) => setSelectedEventId(e.target.value)} sx={{ minWidth: 220 }}>
                {events.map((ev) => (
                  <MenuItem key={ev.id} value={ev.id}>{ev.name}</MenuItem>
                ))}
              </TextField>
              <TextField select label="Fornecedor (vinculado ao evento)" value={eventSupplierId} onChange={(e) => setEventSupplierId(e.target.value)} sx={{ minWidth: 260 }}>
                {eventSuppliers.map((es) => (
                  <MenuItem key={es.eventSupplierId} value={es.eventSupplierId}>{es.name || es.eventSupplierId}</MenuItem>
                ))}
              </TextField>
              <TextField select label="Status" value={status} onChange={(e) => setStatus(e.target.value as any)}>
                {['pending','signed','cancelled'].map((s) => (
                  <MenuItem key={s} value={s}>{s}</MenuItem>
                ))}
              </TextField>
              <TextField label="Sinal" type="number" value={depositAmount ?? ''} onChange={(e) => setDepositAmount(Number(e.target.value))} />
              <TextField label="Vencimento" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} InputLabelProps={{ shrink: true }} />
              <Button variant="contained" type="submit">Criar contrato</Button>
            </Stack>
            <TextField fullWidth multiline minRows={2} sx={{ mt: 2 }} label="Observações" value={notes} onChange={(e) => setNotes(e.target.value)} />
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          </Box>
        </Paper>
      )}
    </Container>
  );
}


