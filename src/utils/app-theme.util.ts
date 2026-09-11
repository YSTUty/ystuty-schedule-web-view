import { blue } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';

import type { ThemeMode } from './theme-mode.util';

/** Создаёт общую тему приложения для основного UI и независимых fallback-экранов. */
export function createAppTheme(mode: ThemeMode) {
  const isDark = mode === 'dark';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? blue[300] : blue[700],
      },
      background: {
        default: isDark ? '#0f172a' : '#f6f8fc',
        paper: isDark ? '#172033' : '#ffffff',
      },
    },
    shape: {
      borderRadius: 12,
    },
    typography: {
      button: {
        fontWeight: 600,
        textTransform: 'none',
      },
    },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },
      MuiIconButton: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
          },
        },
      },
      MuiTextField: {
        defaultProps: {
          size: 'small',
        },
      },
    },
  });
}
