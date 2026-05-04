import { Button, Card, CardContent, Stack, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export function ForbiddenPage() {
  const nav = useNavigate();
  return (
    <Card sx={{ borderRadius: 4, maxWidth: 560 }}>
      <CardContent>
        <Stack spacing={2}>
          <Typography variant="h5" fontWeight={900}>
            Acceso denegado
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Tu usuario no tiene permisos para acceder a esta sección.
          </Typography>
          <Button variant="contained" onClick={() => nav('/app')}>
            Volver al panel
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
}
