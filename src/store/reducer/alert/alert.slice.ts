import { AlertColor } from '@mui/material/Alert';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

let iterId = 0;
export interface IAlert {
  id: number;
  severity: AlertColor;
  message: string;
  createdAt: number;
  toastAutoClose?: number;
}

const initialState = {
  alerts: [] as IAlert[],
};
const MAX_ALERTS = 100;

export const alertSlice = createSlice({
  name: 'alert',
  initialState,
  reducers: {
    add: (
      state,
      action: PayloadAction<{
        severity: AlertColor;
        message: string;
        toastAutoClose?: number;
      }>,
    ) => {
      const { alerts } = state;
      alerts.push({ id: ++iterId, createdAt: Date.now(), ...action.payload });

      if (alerts.length > MAX_ALERTS) {
        alerts.splice(0, alerts.length - MAX_ALERTS);
      }
    },
    remove: (state, action: PayloadAction<{ id: number }>) => {
      state.alerts = state.alerts.filter(
        (alert) => alert.id !== action.payload.id,
      );
    },
    clear: (state) => {
      state.alerts = [];
    },
  },
});

export default alertSlice;
