import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItemButton, ListItemIcon, ListItemText, Box, Divider, Tooltip, Avatar, useTheme } from '@mui/material';
import { Menu as MenuIcon } from '@mui/icons-material';
import EventIcon from '@mui/icons-material/Event';
import StoreIcon from '@mui/icons-material/Store';
import DescriptionIcon from '@mui/icons-material/Description';
import LogoutIcon from '@mui/icons-material/Logout';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../auth/auth.store';

export function Layout({ mode, onToggleMode }: { mode: 'light' | 'dark'; onToggleMode: () => void }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const clear = useAuthStore((s) => s.clear);
  const user = useAuthStore((s) => s.user);
  const theme = useTheme();

  function go(path: string) {
    navigate(path);
    setOpen(false);
  }

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: theme.palette.background.default }}>
      <AppBar position="fixed" color="inherit" elevation={0} sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" onClick={() => setOpen(true)} sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>Event Contract</Typography>
          <Tooltip title={mode === 'light' ? 'Modo escuro' : 'Modo claro'}>
            <IconButton onClick={onToggleMode} color="inherit" sx={{ mr: 1 }}>
              {mode === 'light' ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
          </Tooltip>
          <Tooltip title={user?.name || ''}>
            <Avatar sx={{ width: 32, height: 32 }}>{(user?.name || 'U').charAt(0).toUpperCase()}</Avatar>
          </Tooltip>
        </Toolbar>
      </AppBar>

      <Drawer open={open} onClose={() => setOpen(false)}>
        <Box sx={{ width: 260 }} role="presentation">
          <Box sx={{ px: 2, py: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32 }}>{(user?.name || 'U').charAt(0).toUpperCase()}</Avatar>
            <Box>
              <Typography variant="subtitle2">{user?.name || 'Usuário'}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.id}</Typography>
            </Box>
          </Box>
          <Divider />
          <List>
            {(user?.role === 'planner') && (
              <ListItemButton selected={location.pathname.startsWith('/events')} onClick={() => go('/events')}>
                <ListItemIcon><EventIcon /></ListItemIcon>
                <ListItemText primary="Eventos" />
              </ListItemButton>
            )}
            <ListItemButton selected={location.pathname.startsWith('/suppliers')} onClick={() => go('/suppliers')}>
              <ListItemIcon><StoreIcon /></ListItemIcon>
              <ListItemText primary="Fornecedores" />
            </ListItemButton>
            {(user?.role === 'planner') && (
              <ListItemButton selected={location.pathname.startsWith('/contracts')} onClick={() => go('/contracts')}>
                <ListItemIcon><DescriptionIcon /></ListItemIcon>
                <ListItemText primary="Contratos" />
              </ListItemButton>
            )}
          </List>
          <Divider />
          <List>
            <ListItemButton onClick={() => { clear(); navigate('/login', { replace: true }); }}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Sair" />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
}


