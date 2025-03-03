import React from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { ptBR } from '@mui/material/locale';
import CssBaseline from '@mui/material/CssBaseline';
import AppRoutes from './AppRoutes';
import { NotificationProvider } from './contexts/NotificationContext';

// Create theme - Interface moderna com design mais atual
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#3f51b5', // Indigo mais vibrante
      light: '#757de8',
      dark: '#002984',
      contrastText: '#fff'
    },
    secondary: {
      main: '#00bcd4', // Cyan mais vibrante
      light: '#62efff',
      dark: '#008ba3',
      contrastText: '#fff'
    },
    error: {
      main: '#f44336',
    },
    warning: {
      main: '#ff9800',
    },
    info: {
      main: '#2196f3',
    },
    success: {
      main: '#4caf50',
    },
    background: {
      default: '#f7f9fc',
      paper: '#ffffff'
    },
    divider: 'rgba(0, 0, 0, 0.08)'
  },
  typography: {
    fontFamily: [
      'Inter',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    h1: { fontWeight: 600 },
    h2: { fontWeight: 600 },
    h3: { fontWeight: 600 },
    h4: { fontWeight: 600 },
    h5: { fontWeight: 600 },
    h6: { fontWeight: 600 },
    button: { fontWeight: 600 }
  },
  shape: {
    borderRadius: 10
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          padding: '8px 16px',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)'
          }
        },
        containedPrimary: {
          background: 'linear-gradient(45deg, #3f51b5 30%, #536dfe 90%)'
        },
        containedSecondary: {
          background: 'linear-gradient(45deg, #00bcd4 30%, #00e5ff 90%)'
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(0, 0, 0, 0.04)',
          overflow: 'visible'
        }
      }
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 5px 15px rgba(0, 0, 0, 0.05)'
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)'
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            '& fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.1)',
            },
            '&:hover fieldset': {
              borderColor: 'rgba(0, 0, 0, 0.2)',
            },
          }
        }
      }
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '0.875rem',
        }
      }
    },
    MuiTabs: {
      styleOverrides: {
        indicator: {
          height: 3,
          borderRadius: 3
        }
      }
    }
  }
}, ptBR);

// App with providers
const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <NotificationProvider>
        <AppRoutes />
      </NotificationProvider>
    </ThemeProvider>
  );
};

export default App;
