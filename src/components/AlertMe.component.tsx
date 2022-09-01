import * as React from 'react';
import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import ToggleButton from '@mui/material/ToggleButton';
import List from '@mui/material/List';
import Collapse from '@mui/material/Collapse';
import AnnouncementIcon from '@mui/icons-material/Announcement';
import { useDispatch, useSelector } from 'react-redux';
import { TransitionGroup } from 'react-transition-group';

import alertSlice from '../store/reducer/alert/alert.slice';

export const AlertMe = () => {
    const dispatch = useDispatch();
    const { alerts, show } = useSelector((state) => state.alert);
    (window as any).alertMe = (message: string, severity: any = 'info') =>
        dispatch(alertSlice.actions.add({ message, severity }));

    return (
        <Box sx={{ width: '100%' }}>
            <Collapse in={show !== false && alerts.length > 0}>
                <List sx={{ width: '100%' }}>
                    <TransitionGroup>
                        {alerts.map((alert, index) => (
                            <Collapse key={alert.id} sx={{ my: 1 }}>
                                <Alert
                                    variant="outlined"
                                    severity={alert.severity || 'info'}
                                    onClose={() => dispatch(alertSlice.actions.removeByIndex(index))}
                                >
                                    {alert.message}
                                </Alert>
                            </Collapse>
                        ))}
                    </TransitionGroup>
                </List>
            </Collapse>
            {/* <Button
                variant="outlined"
                onClick={() => {
                    dispatch(alertSlice.actions.add({ message: `Alert! ${Math.random()}`, severity: 'info' }));
                }}
            >
                Add
            </Button> */}
        </Box>
    );
};

export const AlertMeToggler = () => {
    const dispatch = useDispatch();
    const { alerts, show } = useSelector((state) => state.alert);

    return (
        <>
            {alerts.length > 0 && (
                <ToggleButton
                    value="check"
                    selected={show}
                    onChange={() => {
                        dispatch(alertSlice.actions.toggle());
                    }}
                >
                    log <AnnouncementIcon />
                </ToggleButton>
            )}
        </>
    );
};
