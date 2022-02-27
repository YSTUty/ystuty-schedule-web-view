import React from 'react';
import { useIntl } from 'react-intl';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogTitle from '@mui/material/DialogTitle';

import LoadingComponent from './Loading.component';
import { useServiceWorker } from '../shared/ServiceWorker.provider';

const LoadingUpdates = ({ children }: any) => {
    const timer = React.useRef<any>(null);
    const [open, setOpen] = React.useState(false);
    const [showLoading, setShowLoading] = React.useState(false);

    const { isUpdateAvailable, updateAssets } = useServiceWorker()!;
    const { formatMessage } = useIntl();

    const startUpdate = React.useCallback(() => {
        clearTimeout(timer.current);
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
            // startUpdate();
            setOpen(true);
        }
    }, [isUpdateAvailable, startUpdate, setOpen]);

    React.useEffect(
        () => () => {
            clearTimeout(timer.current);
        },
        []
    );

    return showLoading ? (
        <LoadingComponent>{formatMessage({ id: 'badges.loading.update' })}</LoadingComponent>
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
