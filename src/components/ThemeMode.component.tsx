import React from 'react';
import { ToastContainer } from 'react-toastify';
import store2 from 'store2';

import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import { ThemeProvider, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { themeParams, useSignal } from '@tma.js/sdk-react';

import { isTelegramMiniApp } from '@/shared/telegram/telegram.sdk';
import { type AppThemePalette, createAppTheme } from '@/utils/app-theme.util';
import { resolveTelegramThemePalette } from '@/utils/telegram-theme.util';
import {
  THEME_MODE_STORAGE_KEY,
  type ThemeMode,
  toThemeMode,
} from '@/utils/theme-mode.util';

const LAST_THEME_MODE = toThemeMode(store2.get(THEME_MODE_STORAGE_KEY, null));

export const ThemeModeContext = React.createContext({
  toggleColorMode: () => {},
});

export const ThemeModeButton = () => {
  const theme = useTheme();
  const colorMode = React.useContext(ThemeModeContext);

  if (isTelegramMiniApp()) {
    return null;
  }

  return (
    <IconButton onClick={colorMode.toggleColorMode} color="inherit">
      {theme.palette.mode === 'dark' ? (
        <Brightness7Icon />
      ) : (
        <Brightness4Icon />
      )}
    </IconButton>
  );
};

export const ThemeModeProvider = ({
  children,
}: React.PropsWithChildren<{}>) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const telegramThemeIsDark = useSignal(themeParams.isDark);
  const telegramPalette: AppThemePalette = {
    backgroundDefault: useSignal(themeParams.bgColor),
    backgroundPaper: useSignal(themeParams.secondaryBgColor),
    divider: useSignal(themeParams.sectionSeparatorColor),
    primary: useSignal(themeParams.buttonColor),
    primaryContrastText: useSignal(themeParams.buttonTextColor),
    textPrimary: useSignal(themeParams.textColor),
    textSecondary: useSignal(themeParams.hintColor),
  };
  const usesTelegramTheme = isTelegramMiniApp();
  const acceptedTelegramPaletteRef = React.useRef<AppThemePalette>();
  const appTelegramPalette = usesTelegramTheme
    ? resolveTelegramThemePalette(
        acceptedTelegramPaletteRef.current,
        telegramPalette,
      )
    : undefined;

  if (usesTelegramTheme) {
    acceptedTelegramPaletteRef.current = appTelegramPalette;
  }

  const [mode, setMode] = React.useState<ThemeMode>(() =>
    usesTelegramTheme
      ? telegramThemeIsDark
        ? 'dark'
        : 'light'
      : LAST_THEME_MODE || 'light',
  );
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          store2.set(THEME_MODE_STORAGE_KEY, newMode);
          if (prefersDarkMode && prevMode !== 'dark') {
            store2.remove(THEME_MODE_STORAGE_KEY);
          }
          return newMode;
        });
      },
    }),
    [prefersDarkMode],
  );

  React.useEffect(() => {
    if (usesTelegramTheme) {
      setMode(telegramThemeIsDark ? 'dark' : 'light');
    } else if (!LAST_THEME_MODE) {
      setMode(prefersDarkMode ? 'dark' : 'light');
    }
  }, [prefersDarkMode, telegramThemeIsDark, usesTelegramTheme]);

  React.useEffect(() => {
    document.documentElement.dataset.themeMode = mode;
    document.documentElement.style.colorScheme = mode;
  }, [mode]);

  const theme = React.useMemo(
    () => createAppTheme(mode, appTelegramPalette),
    [appTelegramPalette, mode],
  );
  const emotionCache = React.useMemo(
    () => createCache({ key: 'css', speedy: false }),
    [],
  );

  return (
    <ThemeModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <ToastContainer
          position="bottom-left"
          pauseOnHover
          closeButton
          theme={mode}
        />
        <CacheProvider value={emotionCache}>
          <CssBaseline />

          {children}
        </CacheProvider>
      </ThemeProvider>
    </ThemeModeContext.Provider>
  );
};
