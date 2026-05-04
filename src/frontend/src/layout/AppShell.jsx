import { AppBar, Box, Divider, Drawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography } from '@mui/material';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState } from 'react';

import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import PetsIcon from '@mui/icons-material/Pets';
import EventIcon from '@mui/icons-material/Event';
import HealingIcon from '@mui/icons-material/Healing';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';

import { useAuth } from '../state/AuthContext.jsx';

const drawerWidth = 260;

function item(path, label, icon, roles) {
  return { path, label, icon, roles };
}

function hasRole(user, roles) {
  if (!roles || roles.length === 0) return true;
  const r = user?.rol;
  return roles.includes(r);
}

export function AppShell() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const nav = useNavigate();
  const loc = useLocation();

  const items = useMemo(
    () => [
      item('/app', 'Dashboard', <DashboardIcon />, ['admin', 'veterinario', 'auxiliar']),
      item('/app/propietarios', 'Propietarios', <PeopleIcon />, ['admin', 'auxiliar', 'veterinario']),
      item('/app/mascotas', 'Mascotas', <PetsIcon />, ['admin', 'auxiliar', 'veterinario']),
      item('/app/citas', 'Citas', <EventIcon />, ['admin', 'auxiliar', 'veterinario']),
      item('/app/episodios', 'Episodios clínicos', <HealingIcon />, ['admin', 'veterinario']),
      item('/app/tratamientos', 'Tratamientos', <VaccinesIcon />, ['admin', 'veterinario']),
      item('/app/recordatorios', 'Recordatorios', <NotificationsActiveIcon />, ['admin', 'auxiliar'])
    ],
    []
  );

  const filtered = items.filter((it) => hasRole(user, it.roles));

  const drawer = (
    <Box sx={{ height: '100%' }}>
      <Box sx={{ p: 2 }}>
        <Typography variant="subtitle2" color="text.secondary">
          Clínica Veterinaria
        </Typography>
        <Typography variant="h6">San Miguel</Typography>
        <Typography variant="caption" color="text.secondary">
          {user?.nombre} · {user?.rol}
        </Typography>
      </Box>
      <Divider />
      <List sx={{ px: 1 }}>
        {filtered.map((it) => (
          <ListItemButton
            key={it.path}
            selected={loc.pathname === it.path}
            onClick={() => {
              nav(it.path);
              setMobileOpen(false);
            }}
            sx={{ borderRadius: 2, mb: 0.5 }}
          >
            <ListItemIcon>{it.icon}</ListItemIcon>
            <ListItemText primary={it.label} />
          </ListItemButton>
        ))}
      </List>
      <Box sx={{ flex: 1 }} />
      <Divider />
      <List sx={{ px: 1, pb: 2 }}>
        <ListItemButton
          onClick={() => {
            logout();
            nav('/login');
          }}
          sx={{ borderRadius: 2, mt: 1 }}
        >
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Cerrar sesión" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (t) => t.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton color="inherit" edge="start" onClick={() => setMobileOpen((v) => !v)} sx={{ mr: 2, display: { md: 'none' } }}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flex: 1 }}>
            Panel
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            {user?.email}
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }} aria-label="sidebar">
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={() => setMobileOpen(false)}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>

        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8, minHeight: '100vh' }}>
        <Outlet />
      </Box>
    </Box>
  );
}
