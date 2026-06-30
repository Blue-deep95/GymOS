import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    fog: Palette['primary'];
    creamStone: Palette['primary'];
    electricYellow: Palette['primary'];
    graphite: Palette['primary'];
    hairline: Palette['primary'];
  }
  interface PaletteOptions {
    fog?: PaletteOptions['primary'];
    creamStone?: PaletteOptions['primary'];
    electricYellow?: PaletteOptions['primary'];
    graphite?: PaletteOptions['primary'];
    hairline?: PaletteOptions['primary'];
  }
}

// Create custom Material UI Theme according to DESIGN.md
export const theme = createTheme({
  palette: {
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a', // Graphite
      secondary: '#949494', // Muted
      disabled: '#cccccc',
    },
    divider: '#e6e6e6', // Hairline border
    primary: {
      main: '#1a1a1a',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#949494',
      contrastText: '#ffffff',
    },
    // Custom surfaces
    fog: {
      main: '#f2f2f2',
      contrastText: '#1a1a1a',
    },
    creamStone: {
      main: '#f2ede9',
      contrastText: '#1a1a1a',
    },
    electricYellow: {
      main: '#fdf313',
      contrastText: '#1a1a1a',
    },
    graphite: {
      main: '#1a1a1a',
      contrastText: '#ffffff',
    },
    hairline: {
      main: '#e6e6e6',
      contrastText: '#1a1a1a',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: {
      fontFamily: "'Manrope', sans-serif",
      fontSize: '55px',
      fontWeight: 400,
      lineHeight: 1.10,
      letterSpacing: '-0.015em',
      color: '#1a1a1a',
      '@media (max-width: 900px)': {
        fontSize: '42px',
      },
    },
    h2: {
      fontFamily: "'Manrope', sans-serif",
      fontSize: '42px',
      fontWeight: 400,
      lineHeight: 1.15,
      letterSpacing: '-0.014em',
      color: '#1a1a1a',
      '@media (max-width: 900px)': {
        fontSize: '32px',
      },
    },
    h3: {
      fontFamily: "'Manrope', sans-serif",
      fontSize: '32px',
      fontWeight: 500,
      lineHeight: 1.15,
      letterSpacing: '-0.013em',
      color: '#1a1a1a',
      '@media (max-width: 900px)': {
        fontSize: '24px',
      },
    },
    h4: {
      fontFamily: "'Manrope', sans-serif",
      fontSize: '20px',
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '-0.28px',
      color: '#1a1a1a',
    },
    body1: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.004em',
      color: '#1a1a1a',
    },
    body2: {
      fontFamily: "'Inter', sans-serif",
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0.004em',
      color: '#757575', // Dim
    },
    button: {
      fontFamily: "'Manrope', sans-serif",
      fontSize: '16px',
      fontWeight: 500,
      textTransform: 'none',
      letterSpacing: '0.004em',
    },
  },
  // Zero shadow policy: remove elevation shadows from all elements
  shadows: Array(25).fill('none') as any,
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#ffffff',
          color: '#1a1a1a',
          margin: 0,
          padding: 0,
          fontFamily: "'Inter', sans-serif",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: '16px 24px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        outlined: {
          border: '1px solid #1a1a1a',
          color: '#1a1a1a',
          backgroundColor: 'transparent',
          '&:hover': {
            backgroundColor: '#1a1a1a',
            borderColor: '#1a1a1a',
            color: '#ffffff',
          },
        },
        contained: {
          backgroundColor: '#f2f2f2', // Solid neutral (Fog)
          color: '#1a1a1a',
          border: 'none',
          '&:hover': {
            backgroundColor: '#e6e6e6',
          },
        },
        text: {
          color: '#1a1a1a',
          padding: '8px 16px',
          '&:hover': {
            color: '#949494',
            backgroundColor: 'transparent',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          border: 'none',
          borderRadius: 8,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: '#ffffff',
            '& fieldset': {
              borderColor: '#e6e6e6', // Hairline
            },
            '&:hover fieldset': {
              borderColor: '#949494',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#1a1a1a',
              borderWidth: '1px',
            },
          },
        },
      },
    },
  },
});
