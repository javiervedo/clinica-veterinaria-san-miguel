import { Alert } from '@mui/material';

export function ErrorAlert({ error }) {
  if (!error) return null;
  return (
    <Alert severity="error" variant="filled" sx={{ mb: 2 }}>
      {typeof error === 'string' ? error : error.message ?? 'Error inesperado'}
    </Alert>
  );
}
