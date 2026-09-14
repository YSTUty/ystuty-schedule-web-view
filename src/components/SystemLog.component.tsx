import React from 'react';
import { toast } from 'react-toastify';

import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AnalyticsOutlinedIcon from '@mui/icons-material/AnalyticsOutlined';
import CloseIcon from '@mui/icons-material/Close';

import { notifyTelegramResult } from '@/shared/telegram/telegram.sdk';
import { useDispatch, useSelector } from '@/store';
import alertSlice, { IAlert } from '@/store/reducer/alert/alert.slice';

const LOG_TOAST_AUTO_CLOSE = 8e3;

function formatLogDate(value: number): string {
  return new Intl.DateTimeFormat('ru-RU', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(value);
}

function showToast(alert: IAlert): void {
  toast[alert.severity](alert.message, {
    autoClose: LOG_TOAST_AUTO_CLOSE,
    toastId: `system-log-${alert.id}`,
  });
}

function getAlertTitle(alert: IAlert): string {
  switch (alert.severity) {
    case 'error':
      return 'Ошибка';
    case 'warning':
      return 'Предупреждение';
    case 'success':
      return 'Успешно';
    case 'info':
      return 'Информация';
  }
}

/**
 * Публикует новые записи журнала как временные toast-уведомления.
 * Сама история показывается отдельной кнопкой и не занимает место над шапкой.
 */
export const SystemLog = () => {
  const alerts = useSelector((state) => state.alert.alerts);
  const lastToastIdRef = React.useRef(0);

  React.useEffect(() => {
    for (const alert of alerts) {
      if (alert.id > lastToastIdRef.current) {
        showToast(alert);
        if (alert.severity === 'error' || alert.severity === 'warning') {
          notifyTelegramResult(alert.severity);
        }
      }
    }

    const lastAlert = alerts[alerts.length - 1];
    lastToastIdRef.current = lastAlert?.id ?? lastToastIdRef.current;
  }, [alerts]);

  return null;
};

export const SystemLogButton = () => {
  const dispatch = useDispatch();
  const alerts = useSelector((state) => state.alert.alerts);
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <>
      <Tooltip title="Системный журнал">
        <IconButton
          aria-label="Открыть системный журнал"
          color="inherit"
          size="small"
          onClick={() => setIsOpen(true)}
          sx={{
            bottom: 8,
            opacity: 0.65,
            position: 'fixed',
            right: 8,
            zIndex: (theme) => theme.zIndex.modal - 1,
          }}>
          <Badge
            color="error"
            overlap="circular"
            variant="dot"
            invisible={alerts.length === 0}>
            <AnalyticsOutlinedIcon fontSize="inherit" />
          </Badge>
        </IconButton>
      </Tooltip>

      <Dialog
        fullWidth
        maxWidth="sm"
        open={isOpen}
        onClose={() => setIsOpen(false)}>
        <DialogTitle component="div">
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
            <Box sx={{ flex: 1 }}>
              <Typography component="h2" variant="h6">
                Системный журнал
              </Typography>
              <Typography color="text.secondary" variant="caption">
                {alerts.length > 0
                  ? `Записей: ${alerts.length}`
                  : 'Сообщения текущей сессии'}
              </Typography>
            </Box>
            <Tooltip title="Закрыть">
              <IconButton
                aria-label="Закрыть системный журнал"
                onClick={() => setIsOpen(false)}>
                <CloseIcon />
              </IconButton>
            </Tooltip>
          </Stack>
        </DialogTitle>
        <DialogContent dividers>
          {alerts.length > 0 ? (
            <Stack spacing={1.5}>
              {[...alerts].reverse().map((alert) => (
                <Alert
                  key={alert.id}
                  action={
                    <Tooltip title="Удалить запись">
                      <IconButton
                        aria-label="Удалить запись"
                        color="inherit"
                        size="small"
                        onClick={() =>
                          dispatch(alertSlice.actions.remove({ id: alert.id }))
                        }>
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  }
                  severity={alert.severity}
                  variant="outlined"
                  sx={{
                    '& .MuiAlert-action': {
                      alignItems: 'flex-start',
                      mt: -0.25,
                    },
                    '& .MuiAlert-message': { minWidth: 0, width: '100%' },
                  }}>
                  <Stack spacing={0.75}>
                    <Stack
                      direction="row"
                      spacing={1}
                      sx={{ alignItems: 'baseline' }}>
                      <AlertTitle sx={{ mb: 0 }}>
                        {getAlertTitle(alert)}
                      </AlertTitle>
                      <Typography
                        color="text.secondary"
                        sx={{ ml: 'auto', whiteSpace: 'nowrap' }}
                        variant="caption">
                        {formatLogDate(alert.createdAt)}
                      </Typography>
                    </Stack>
                    <Typography
                      sx={{ overflowWrap: 'anywhere' }}
                      variant="body2">
                      {alert.message}
                    </Typography>
                  </Stack>
                </Alert>
              ))}
            </Stack>
          ) : (
            <Box color="text.secondary">Системных сообщений пока нет.</Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            color="inherit"
            disabled={alerts.length === 0}
            onClick={() => dispatch(alertSlice.actions.clear())}>
            Очистить
          </Button>
          <Button onClick={() => setIsOpen(false)}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
