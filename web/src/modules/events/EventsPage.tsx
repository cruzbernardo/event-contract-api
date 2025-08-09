import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../shared/api.ts';
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useNotify } from '../../shared/notifications';

type EventItem = {
  id: string;
  name: string;
  eventDate: string;
  totalBudget: number;
};

export function EventsPage() {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const notify = useNotify();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await api.get('/events');
        setEvents(data);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  async function createEvent(e: React.FormEvent) {
    e.preventDefault();
    try {
      setError(null);
      const payload = {
        name,
        description: description || undefined,
        eventDate: new Date(eventDate),
        totalBudget,
      };
      const { data } = await api.post('/events', payload);
      setEvents((prev) => [...prev, data]);
      setName('');
      setDescription('');
      setEventDate('');
      setTotalBudget(0);
      notify('Evento criado com sucesso', 'success');
      setDialogOpen(false);
    } catch (e: any) {
      setError(e?.response?.data?.message?.[0] || e?.response?.data?.message || 'Falha ao criar evento');
    }
  }

  if (loading) return <Container sx={{ mt: 4 }}><Typography>Carregando...</Typography></Container>;

  return (
    <Container sx={{ mt: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5">Meus Eventos</Typography>
        <Button variant="contained" onClick={() => setDialogOpen(true)}>Novo evento</Button>
      </Stack>

      <Paper sx={{ mb: 3 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Data</TableCell>
                <TableCell align="right">Orçamento</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3}>
                    <Typography color="text.secondary">Nenhum evento cadastrado</Typography>
                  </TableCell>
                </TableRow>
              )}
              {events.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((ev) => (
                <TableRow hover key={ev.id} sx={{ cursor: 'pointer' }} onClick={() => navigate(`/events/${ev.id}`)}>
                  <TableCell>{ev.name}</TableCell>
                  <TableCell>{new Date(ev.eventDate).toLocaleDateString()}</TableCell>
                  <TableCell align="right">{Number(ev.totalBudget || 0).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={events.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Novo evento</DialogTitle>
        <Box component="form" onSubmit={createEvent}>
          <DialogContent>
            <Stack spacing={2}>
              <TextField label="Nome" value={name} onChange={(e) => setName(e.target.value)} required />
              <TextField label="Descrição" value={description} onChange={(e) => setDescription(e.target.value)} />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField label="Data" type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} InputLabelProps={{ shrink: true }} required />
                <TextField label="Orçamento" type="number" value={totalBudget} onChange={(e) => setTotalBudget(Number(e.target.value))} />
              </Stack>
              {error && <Typography color="error">{error}</Typography>}
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="contained">Criar</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Container>
  );
}


