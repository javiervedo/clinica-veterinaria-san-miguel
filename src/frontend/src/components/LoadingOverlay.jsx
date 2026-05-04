import { Backdrop, CircularProgress, Typography, Stack } from '@mui/material';

export function LoadingOverlay({ open, label = 'Cargando...' }) {
  return (
    <Backdrop open={open} sx={{ color: '#fff', zIndex: (t) => t.zIndex.drawer + 1 }}>
      <Stack spacing={2} alignItems="center">
        <CircularProgress color="inherit" />
        <Typography variant="body2">{label}</Typography>
      </Stack>
    </Backdrop>
  );
}
