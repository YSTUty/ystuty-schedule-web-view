import React from 'react';

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

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
    if (!rateLimit || remainingSeconds === 0) {
      return;
    }

    const interval = window.setInterval(() => setNow(Date.now()), 1e3);

    return () => window.clearInterval(interval);
  }, [rateLimit, remainingSeconds]);

  React.useEffect(() => {
    if (!rateLimit || remainingSeconds > 0) {
      return;
    }

    const timeout = window.setTimeout(clearApiRateLimitState, 20e3);

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

  return (
    <Snackbar
      anchorOrigin={{ horizontal: 'center', vertical: 'top' }}
      open
      sx={{ maxWidth: 'calc(100% - 16px)', mt: { xs: 1, sm: 2 } }}>
      <Alert
        action={
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
        }
        severity={isWaiting ? 'warning' : 'info'}
        variant="filled"
        sx={{ width: '100%' }}>
        <AlertTitle>
          {isWaiting
            ? 'Слишком много запросов к расписанию'
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
      </Alert>
    </Snackbar>
  );
};

export default RateLimitNotice;
