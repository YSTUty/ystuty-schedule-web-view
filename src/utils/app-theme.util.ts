import { blue } from '@mui/material/colors';
import {
  createTheme,
  darken,
  getContrastRatio,
  lighten,
} from '@mui/material/styles';

import type { ThemeMode } from './theme-mode.util';

export type AppThemePalette = {
  backgroundDefault?: string;
  backgroundPaper?: string;
  divider?: string;
  primary?: string;
  primaryContrastText?: string;
  textPrimary?: string;
  textSecondary?: string;
};

const MIN_BACKGROUND_CONTRAST = 1.08;

/**
 * Разводит близкие фон и поверхность карточек Telegram, сохраняя их исходный
 * цвет, когда контраст уже достаточен.
 */
function getPaperBackground(
  backgroundDefault: string,
  backgroundPaper: string,
  isDark: boolean,
): string {
  try {
    const initialContrast = getContrastRatio(
      backgroundDefault,
      backgroundPaper,
    );

    if (initialContrast >= MIN_BACKGROUND_CONTRAST) {
      return backgroundPaper;
    }

    const lighterPaper = lighten(backgroundPaper, isDark ? 0.09 : 0.06);
    if (getContrastRatio(backgroundDefault, lighterPaper) > initialContrast) {
      return lighterPaper;
    }

    return darken(backgroundPaper, 0.04);
  } catch {
    return backgroundPaper;
  }
}

/** Создаёт общую тему приложения для основного UI и независимых fallback-экранов. */
export function createAppTheme(mode: ThemeMode, palette: AppThemePalette = {}) {
  const isDark = mode === 'dark';
  const primary = palette.primary || (isDark ? blue[300] : blue[700]);
  const backgroundDefault =
    palette.backgroundDefault || (isDark ? '#0f172a' : '#f6f8fc');
  const backgroundPaper = getPaperBackground(
    backgroundDefault,
    palette.backgroundPaper || (isDark ? '#172033' : '#ffffff'),
    isDark,
  );

  return createTheme({
    palette: {
      mode,
      primary: {
        main: primary,
        ...(palette.primaryContrastText
          ? { contrastText: palette.primaryContrastText }
          : {}),
      },
      background: {
        default: backgroundDefault,
        paper: backgroundPaper,
      },
      ...(palette.textPrimary || palette.textSecondary
        ? {
            text: {
              ...(palette.textPrimary ? { primary: palette.textPrimary } : {}),
              ...(palette.textSecondary
                ? { secondary: palette.textSecondary }
                : {}),
            },
          }
        : {}),
      ...(palette.divider ? { divider: palette.divider } : {}),
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
