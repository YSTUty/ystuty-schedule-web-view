import React from 'react';
import { ToastContainer } from 'react-toastify';
import store2 from 'store2';

import { blue as primary } from '@mui/material/colors';
import CssBaseline from '@mui/material/CssBaseline';
import IconButton from '@mui/material/IconButton';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';

const STORE_THEME_MODE_KEY = 'themeMode';
const LAST_THEME_MODE = store2.get(STORE_THEME_MODE_KEY, null) as
  | 'light'
  | 'dark'
  | null;

export const ThemeModeContext = React.createContext({
  toggleColorMode: () => {},
});

export const ThemeModeButton = () => {
  const theme = useTheme();
  const colorMode = React.useContext(ThemeModeContext);
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
  const [mode, setMode] = React.useState<'light' | 'dark'>(
    LAST_THEME_MODE || 'light',
  );
  const colorMode = React.useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => {
          const newMode = prevMode === 'light' ? 'dark' : 'light';
          store2.set(STORE_THEME_MODE_KEY, newMode);
          if (prefersDarkMode && prevMode !== 'dark') {
            store2.remove(STORE_THEME_MODE_KEY);
          }
          return newMode;
        });
      },
    }),
    [prefersDarkMode],
  );

  React.useEffect(() => {
    !LAST_THEME_MODE && setMode(prefersDarkMode ? 'dark' : 'light');
  }, [prefersDarkMode]);

  const theme = React.useMemo(
    () => createTheme({ palette: { mode, primary } }),
    [mode],
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
