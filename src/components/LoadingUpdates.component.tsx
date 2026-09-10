import React from 'react';
import { useIntl } from 'react-intl';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

import { useServiceWorker } from '@/shared/ServiceWorker.provider';
import LoadingComponent from './Loading.component';

const LoadingUpdates = ({ children }: React.PropsWithChildren<{}>) => {
  const timer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = React.useState(false);
  const [showLoading, setShowLoading] = React.useState(false);

  const { isUpdateAvailable, updateAssets } = useServiceWorker()!;
  const { formatMessage } = useIntl();

  const startUpdate = React.useCallback(() => {
    if (timer.current !== null) {
      clearTimeout(timer.current);
    }
    setShowLoading(true);
    updateAssets();
    timer.current = setTimeout(() => {
      window.location.reload();
    }, 8e3);
  }, [timer, updateAssets, setShowLoading]);

  const handleClose = React.useCallback(() => {
    setOpen(false);
  }, [setOpen]);

  React.useEffect(() => {
    if (isUpdateAvailable) {
      startUpdate();
      // setOpen(true);
    }
  }, [isUpdateAvailable, startUpdate, setOpen]);

  React.useEffect(
    () => () => {
      if (timer.current !== null) {
        clearTimeout(timer.current);
      }
    },
    [],
  );

  return showLoading ? (
    <LoadingComponent>
      {formatMessage({ id: 'badges.loading.update' })}
    </LoadingComponent>
  ) : (
    <>
      <div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Доступно обновление!</DialogTitle>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Скрыть
            </Button>
            <Button onClick={startUpdate} color="inherit" autoFocus>
              ОБНОВИТЬ
            </Button>
          </DialogActions>
        </Dialog>
      </div>
      {children}
    </>
  );
};

export default React.memo(LoadingUpdates);
