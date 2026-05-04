import { Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { useAuth } from '../state/AuthContext.jsx';

function StatCard({ title, value, subtitle }) {
  return (
    <Card sx={{ borderRadius: 4 }}>
      <CardContent>
        <Stack spacing={0.5}>
          <Typography variant="overline" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={800}>
            {value}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {subtitle}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <Stack spacing={2}>
      <Typography variant="h4" fontWeight={900}>
        Bienvenido/a, {user?.nombre}
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Panel de gestión de la Clínica Veterinaria San Miguel.
      </Typography>

      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid xs={12} md={4}>
          <StatCard title="Módulos" value="6" subtitle="Propietarios, Mascotas, Citas, Episodios, Tratamientos, Recordatorios" />
        </Grid>
        <Grid xs={12} md={4}>
          <StatCard title="Seguridad" value="JWT" subtitle="Rutas protegidas + middleware de roles (RBAC)" />
        </Grid>
        <Grid xs={12} md={4}>
          <StatCard title="Usuario" value={user?.rol ?? '-'} subtitle={user?.email ?? ''} />
        </Grid>
      </Grid>

      <Card sx={{ borderRadius: 4 }}>
        <CardContent>
          <Typography variant="h6" fontWeight={800} sx={{ mb: 1 }}>
            Cómo usar
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Navega por el menú lateral para gestionar los datos. Si tu rol no tiene permisos para una sección, no aparecerá en el menú.
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}
