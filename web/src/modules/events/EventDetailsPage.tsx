import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../shared/api.ts';
import { Box, Button, Container, Divider, Grid, Paper, Stack, TextField, Typography, List, ListItem, ListItemText, MenuItem } from '@mui/material';
import { useNotify } from '../../shared/notifications';

type EventDetails = {
  id: string;
  name: string;
  description?: string;
  eventDate: string;
  totalBudget: number;
  clients: Array<{ id: string; email?: string }>;
  suppliers: Array<{ id: string; name?: string; eventSupplierId: string; agreedPrice: number; contractId?: string }>;
};

export function EventDetailsPage() {
  const { id } = useParams();
  const [event, setEvent] = useState<EventDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [clientUserId, setClientUserId] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [agreedPrice, setAgreedPrice] = useState<number>(0);
  const [suppliers, setSuppliers] = useState<Array<{ id: string; name: string }>>([]);
  const notify = useNotify();

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/events/${id}`);
        setEvent(data);
        const suppliersResp = await api.get('/suppliers');
        setSuppliers((suppliersResp.data || []).map((s: any) => ({ id: s.id, name: s.name })));
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  async function inviteClient(e: React.FormEvent) {
    e.preventDefault();
    if (!clientUserId) {
      notify('Informe o ID do usuário cliente', 'warning');
      return;
    }
    try {
      await api.post(`/events/${id}/invite-client`, { clientUserId });
      const { data } = await api.get(`/events/${id}`);
      setEvent(data);
      setClientUserId('');
      notify('Cliente convidado com sucesso', 'success');
    } catch (err: any) {
      notify(err?.response?.data?.message?.[0] || err?.response?.data?.message || 'Falha ao convidar cliente', 'error');
    }
  }

  async function attachSupplier(e: React.FormEvent) {
    e.preventDefault();
    if (!supplierId) {
      notify('Selecione um fornecedor', 'warning');
      return;
    }
    if (!agreedPrice || agreedPrice <= 0) {
      notify('Informe um preço válido', 'warning');
      return;
    }
    try {
      await api.post(`/events/${id}/attach-supplier`, { supplierId, agreedPrice });
      const { data } = await api.get(`/events/${id}`);
      setEvent(data);
      setSupplierId('');
      setAgreedPrice(0);
      notify('Fornecedor atrelado com sucesso', 'success');
    } catch (err: any) {
      notify(err?.response?.data?.message?.[0] || err?.response?.data?.message || 'Falha ao atrelar fornecedor', 'error');
    }
  }

  if (loading) return <Container sx={{ mt: 4 }}><Typography>Carregando...</Typography></Container>;
  if (!event) return <Container sx={{ mt: 4 }}><Typography>Evento não encontrado</Typography></Container>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5">{event.name}</Typography>
      <Typography sx={{ mb: 2 }}>Data: {new Date(event.eventDate).toLocaleDateString()} • Orçamento: R$ {event.totalBudget}</Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Clientes</Typography>
          <Paper sx={{ mb: 2 }}>
            <List>
              {event.clients.map((c) => (
                <ListItem key={c.id}>
                  <ListItemText primary={c.email || c.id} />
                </ListItem>
              ))}
            </List>
          </Paper>
          <Paper sx={{ p: 2 }}>
            <Box component="form" onSubmit={inviteClient}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField fullWidth label="ID do usuário cliente" value={clientUserId} onChange={(e) => setClientUserId(e.target.value)} />
                <Button variant="contained" type="submit">Convidar</Button>
              </Stack>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h6">Fornecedores</Typography>
          <Paper sx={{ mb: 2 }}>
            <List>
              {event.suppliers.map((s) => (
                <ListItem key={s.eventSupplierId}>
                  <ListItemText primary={`${s.name || s.id} - R$ ${s.agreedPrice}`} secondary={s.contractId ? 'com contrato' : 'sem contrato'} />
                </ListItem>
              ))}
            </List>
          </Paper>
          <Paper sx={{ p: 2 }}>
            <Box component="form" onSubmit={attachSupplier}>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField fullWidth select label="Fornecedor" value={supplierId} onChange={(e) => setSupplierId(e.target.value)}>
                  {suppliers.map((s) => (
                    <MenuItem key={s.id} value={s.id}>{s.name}</MenuItem>
                  ))}
                </TextField>
                <TextField fullWidth label="Preço acordado" type="number" inputProps={{ min: 0 }} value={agreedPrice} onChange={(e) => setAgreedPrice(Number(e.target.value))} />
                <Button variant="contained" type="submit">Atrelar fornecedor</Button>
              </Stack>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}


