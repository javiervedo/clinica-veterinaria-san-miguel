import { Box, Button, Card, CardContent, Container, Stack, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { buildApi } from '../api/index.js';
import { useAuth } from '../state/AuthContext.jsx';
import { ErrorAlert } from '../components/ErrorAlert.jsx';
import { LoadingOverlay } from '../components/LoadingOverlay.jsx';
import { toApiError } from '../api/apiClient.js';

export function LoginPage() {
  const nav = useNavigate();
  const { setSession, token, logout } = useAuth();

  const api = useMemo(
    () =>
      buildApi({
        getToken: () => token,
        onUnauthorized: () => logout()
      }),
    [token, logout]
  );

  const [form, setForm] = useState({ email: 'admin@sanmiguel.com', password: 'admin123' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const data = await api.auth.login(form);
      setSession({ token: data.token, user: data.user });
      nav('/app', { replace: true });
    } catch (err) {
      setError(toApiError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', background: 'linear-gradient(135deg, #0B5FFF 0%, #00A389 100%)' }}>
      <LoadingOverlay open={loading} label="Iniciando sesión..." />
      <Container maxWidth="sm">
        <Card sx={{ borderRadius: 4, boxShadow: 12 }}>
          <CardContent sx={{ p: 4 }}>
            <Stack spacing={1} sx={{ mb: 3 }}>
              <Typography variant="overline" color="text.secondary">
                Clínica Veterinaria
              </Typography>
              <Typography variant="h4" fontWeight={800}>
                San Miguel
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Acceso al panel de gestión
              </Typography>
            </Stack>

            <ErrorAlert error={error?.message ?? null} />

            <Box component="form" onSubmit={onSubmit}>
              <Stack spacing={2}>
                <TextField
                  label="Email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))}
                  required
                />
                <TextField
                  label="Contraseña"
                  type="password"
                  autoComplete="current-password"
                  value={form.password}
                  onChange={(e) => setForm((v) => ({ ...v, password: e.target.value }))}
                  required
                />
                <Button type="submit" variant="contained" size="large">
                  Entrar
                </Button>

                <Typography variant="caption" color="text.secondary">
                  Demo: admin@sanmiguel.com / admin123
                </Typography>
              </Stack>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
}
