import * as React from 'react';
import { useNetworkState } from 'react-use';
import store2 from 'store2';

import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import RefreshIcon from '@mui/icons-material/Refresh';

import {
  THEME_MODE_STORAGE_KEY,
  type ThemeMode,
  toThemeMode,
} from '@/utils/theme-mode.util';

type EnvUnsupportedProps = {
  error?: Error;
};

export type EnvUnsupportedState = 'offline' | 'runtime-error' | 'unsupported';

/** Определяет основную причину, не маскируя ошибку кода сообщением о сети. */
export function getEnvUnsupportedState(
  error: Error | undefined,
  isOnline: boolean | undefined,
): EnvUnsupportedState {
  if (isOnline === false) {
    return 'offline';
  }

  return error ? 'runtime-error' : 'unsupported';
}

/** Берёт последний режим приложения, затем сохранённую настройку и системную тему. */
export function resolveEnvUnsupportedTheme(
  documentTheme: string | undefined,
  storedTheme: unknown,
  prefersDarkMode: boolean,
): ThemeMode {
  return (
    toThemeMode(documentTheme) ||
    toThemeMode(storedTheme) ||
    (prefersDarkMode ? 'dark' : 'light')
  );
}

/** Fallback для неподдерживаемой среды или фатальной ошибки старта приложения. */
const EnvUnsupported = ({ error }: EnvUnsupportedProps) => {
  const { online } = useNetworkState();
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const themeMode = resolveEnvUnsupportedTheme(
    document.documentElement.dataset.themeMode,
    store2.get(THEME_MODE_STORAGE_KEY, null),
    prefersDarkMode,
  );
  const theme = React.useMemo(
    () => createTheme({ palette: { mode: themeMode } }),
    [themeMode],
  );
  const state = getEnvUnsupportedState(error, online);
  const isOffline = state === 'offline';
  const isRuntimeError = state === 'runtime-error';

  const title = isOffline
    ? 'Нет подключения к интернету'
    : isRuntimeError
      ? 'Не удалось запустить расписание'
      : 'Среда не поддерживается';

  const description = isOffline
    ? 'Браузер сообщает, что соединение с сетью недоступно. Проверьте интернет и повторите попытку.'
    : isRuntimeError
      ? 'В приложении произошла внутренняя ошибка. Попробуйте обновить страницу.'
      : 'Откройте приложение в современном браузере или обновите встроенный браузер.';

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        component="main"
        role="alert"
        sx={{
          alignItems: 'center',
          bgcolor: 'background.default',
          display: 'flex',
          justifyContent: 'center',
          minHeight: '100dvh',
          p: 3,
        }}>
        <Paper
          elevation={4}
          sx={{ maxWidth: 520, p: { xs: 3, sm: 4 }, width: '100%' }}>
          <Stack spacing={3} alignItems="center">
            <Avatar
              sx={{
                bgcolor: isOffline ? 'warning.main' : 'error.main',
                height: 56,
                width: 56,
              }}>
              {isOffline ? <CloudOffIcon /> : <ErrorOutlineIcon />}
            </Avatar>

            <Box textAlign="center">
              <Typography component="h1" variant="h5" gutterBottom>
                {title}
              </Typography>
              <Typography color="text.secondary">{description}</Typography>
            </Box>

            {isOffline && (
              <Alert severity="warning" sx={{ width: '100%' }}>
                Сохранённые данные могут быть доступны после повторного открытия
                приложения.
              </Alert>
            )}

            {isDev && error && (
              <Alert severity="error" sx={{ width: '100%' }}>
                <Typography
                  component="pre"
                  sx={{ m: 0, overflow: 'auto', whiteSpace: 'pre-wrap' }}>
                  {error.message}
                </Typography>
              </Alert>
            )}

            <Button
              variant="contained"
              startIcon={<RefreshIcon />}
              onClick={() => window.location.reload()}>
              Перезагрузить
            </Button>
          </Stack>
        </Paper>
      </Box>
    </ThemeProvider>
  );
};

export default EnvUnsupported;
