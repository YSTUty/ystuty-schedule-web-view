import React from 'react';

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import { alpha } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';

import {
  clearApiRateLimitState,
  getApiRateLimitState,
  subscribeToApiRateLimit,
} from '@/shared/api.rate-limit.utils';

function getRemainingSeconds(expiresAt: number, now: number): number {
  return Math.max(0, Math.ceil((expiresAt - now) / 1e3));
}

function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return [minutes, remainingSeconds]
    .map((value) => String(value).padStart(2, '0'))
    .join(':');
}

const releasedNoticeDuration = 12e3;

/**
 * Показывает активный лимит в месте прежних баннеров ошибок и не даёт
 * пользователю бессмысленно повторять запросы до сброса ограничения.
 */
const RateLimitNotice = () => {
  const rateLimit = React.useSyncExternalStore(
    subscribeToApiRateLimit,
    getApiRateLimitState,
    getApiRateLimitState,
  );
  const [now, setNow] = React.useState(Date.now);
  const remainingSeconds = rateLimit
    ? getRemainingSeconds(rateLimit.expiresAt, now)
    : 0;

  React.useEffect(() => {
    if (!rateLimit) {
      return;
    }

    // После снятия лимита таймер нужен для плавного автоскрытия уведомления.
    const interval = window.setInterval(() => setNow(Date.now()), 250);

    return () => window.clearInterval(interval);
  }, [rateLimit]);

  React.useEffect(() => {
    if (!rateLimit || remainingSeconds > 0) {
      return;
    }

    const timeout = window.setTimeout(
      clearApiRateLimitState,
      releasedNoticeDuration,
    );

    return () => window.clearTimeout(timeout);
  }, [rateLimit, remainingSeconds]);

  if (!rateLimit) {
    return null;
  }

  const isWaiting = remainingSeconds > 0;
  const limitDetails =
    rateLimit.limit !== undefined
      ? `Лимит API: ${rateLimit.limit} запросов.`
      : null;
  const releasedProgress = Math.min(
    100,
    Math.max(0, ((now - rateLimit.expiresAt) / releasedNoticeDuration) * 100),
  );

  return (
    <Snackbar
      anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      open
      sx={{ maxWidth: 'calc(100% - 16px)', mt: { xs: 1, sm: 2 } }}>
      <Alert
        action={
          <Stack direction="row" spacing={0.5}>
            <Button
              color="inherit"
              disabled={isWaiting}
              size="small"
              onClick={() => {
                clearApiRateLimitState();
                window.location.reload();
              }}>
              Повторить загрузку
            </Button>
            <IconButton
              aria-label="Закрыть уведомление о лимите запросов"
              color="inherit"
              size="small"
              onClick={clearApiRateLimitState}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Stack>
        }
        severity={isWaiting ? 'warning' : 'info'}
        variant="filled"
        sx={{
          width: '100%',
          position: 'relative',
          pb: isWaiting ? undefined : 1.5,
          // Полупрозрачным делаем только фон, чтобы сообщение и действия
          // не теряли контраст на светлой и тёмной темах.
          bgcolor: (theme) =>
            alpha(theme.palette[isWaiting ? 'warning' : 'info'].dark, 0.75),
        }}>
        <AlertTitle>
          {isWaiting
            ? 'Слишком много запросов к серверу'
            : 'Лимит запросов снят'}
        </AlertTitle>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          spacing={{ xs: 0.5, sm: 1 }}
          sx={{ alignItems: { sm: 'center' } }}>
          <Typography variant="body2">
            {isWaiting
              ? 'Новые запросы будут доступны через'
              : 'Можно повторить загрузку данных.'}
          </Typography>
          {isWaiting && (
            <Typography
              component="output"
              sx={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700 }}
              variant="body2">
              {formatDuration(remainingSeconds)}
            </Typography>
          )}
        </Stack>
        {limitDetails && (
          <Typography
            color="text.secondary"
            sx={{ display: 'block', mt: 0.75 }}
            variant="caption">
            {limitDetails}
          </Typography>
        )}
        {!isWaiting && (
          <LinearProgress
            aria-label="Время до автоматического закрытия уведомления"
            color="inherit"
            variant="determinate"
            value={releasedProgress}
            sx={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              left: 0,
              opacity: 0.6,
            }}
          />
        )}
      </Alert>
    </Snackbar>
  );
};

export default RateLimitNotice;
