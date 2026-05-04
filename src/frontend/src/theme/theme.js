import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    mode: 'light',
    primary: { main: '#0B5FFF' },
    secondary: { main: '#00A389' },
    background: { default: '#F6F8FB', paper: '#FFFFFF' }
  },
  shape: { borderRadius: 12 },
  typography: {
    fontFamily: ['Inter', 'system-ui', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif'].join(',')
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true }
    }
  }
});
