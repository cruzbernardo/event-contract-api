import { useEffect, useState } from 'react';
import { api } from '../../shared/api';
import {
  Box,
  Button,
  Container,
  Paper,
  Stack,
  TextField,
  Typography,
  Alert,
  MenuItem,
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
import { useAuthStore } from '../auth/auth.store';
import { useNotify } from '../../shared/notifications';

type Supplier = {
  id: string;
  name: string;
  category: string;
  contactName: string;
  email: string;
  phone: string;
};

export function SuppliersPage() {
  const [list, setList] = useState<Supplier[]>([]);
  const [form, setForm] = useState<Partial<Supplier>>({});
  const [error, setError] = useState<string | null>(null);
  const user = useAuthStore((s) => s.user);
  const notify = useNotify();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/suppliers');
      setList(data);
    })();
  }, []);

  async function createSupplier(e: React.FormEvent) {
    e.preventDefault();
    try {
      setError(null);
      const { data } = await api.post('/suppliers', form);
      setList((prev) => [...prev, data]);
      setForm({});
      notify('Fornecedor cadastrado com sucesso', 'success');
    } catch (err: any) {
      setError(err?.response?.data?.message?.[0] || err?.response?.data?.message || 'Falha ao cadastrar fornecedor');
    }
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
        <Typography variant="h5">Fornecedores</Typography>
        {user?.role === 'planner' && (
          <Button variant="contained" onClick={() => setDialogOpen(true)}>Novo fornecedor</Button>
        )}
      </Stack>

      <Paper sx={{ mb: 3 }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Categoria</TableCell>
                <TableCell>Contato</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Telefone</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5}>
                    <Typography color="text.secondary">Nenhum fornecedor cadastrado</Typography>
                  </TableCell>
                </TableRow>
              )}
              {list.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((s) => (
                <TableRow key={s.id} hover>
                  <TableCell>{s.name}</TableCell>
                  <TableCell>{s.category}</TableCell>
                  <TableCell>{s.contactName}</TableCell>
                  <TableCell>{s.email}</TableCell>
                  <TableCell>{s.phone}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          component="div"
          count={list.length}
          page={page}
          onPageChange={(_, p) => setPage(p)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Paper>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle>Novo fornecedor</DialogTitle>
        <Box component="form" onSubmit={createSupplier}>
          <DialogContent>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mb: 2 }}>
              <TextField fullWidth label="Nome" value={form.name || ''} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <TextField fullWidth select label="Categoria" value={form.category || ''} onChange={(e) => setForm({ ...form, category: e.target.value })} required>
                {['venue','catering','photography','florist','music','decoration','transportation','other'].map((c) => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </TextField>
            </Stack>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={2}>
              <TextField fullWidth label="Contato" value={form.contactName || ''} onChange={(e) => setForm({ ...form, contactName: e.target.value })} required />
              <TextField fullWidth label="Email" type="email" value={form.email || ''} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <TextField fullWidth label="Telefone" value={form.phone || ''} onChange={(e) => setForm({ ...form, phone: e.target.value })} required />
            </Stack>
            {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button type="submit" variant="contained">Salvar</Button>
          </DialogActions>
        </Box>
      </Dialog>
    </Container>
  );
}


