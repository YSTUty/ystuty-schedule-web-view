import { AlertColor } from '@mui/material/Alert';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

let iterId = 0;
export interface IAlert {
    id: number;
    severity: AlertColor;
    message: string;
}

const initialState = {
    alerts: [] as IAlert[],
    show: true,
};

export const alertSlice = createSlice({
    name: 'alert',
    initialState,
    reducers: {
        add: (state, action: PayloadAction<{ severity: AlertColor; message: string }>) => {
            const { alerts } = state;
            alerts.push({ id: ++iterId, ...action.payload });

            toast[action.payload.severity](action.payload.message, {
                autoClose: 8e3,
            });
        },
        removeByIndex: (state, action: PayloadAction<number>) => {
            state.alerts = state.alerts.filter((e, i) => i !== action.payload);
        },
        clear: (state) => {
            state.alerts = [];
        },
        toggle: (state, action: PayloadAction<boolean | undefined>) => {
            state.show = action.payload ?? !state.show;
        },
    },
});

export default alertSlice;
