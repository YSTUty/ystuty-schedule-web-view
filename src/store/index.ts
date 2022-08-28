import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { createBrowserHistory } from 'history';

import scheduleSlice from './reducer/schedule/schedule.slice';
import alertSlice from './reducer/alert/alert.slice';

export const reducer = combineReducers({
    schedule: scheduleSlice.reducer,
    alert: alertSlice.reducer,
});

export type RootState = ReturnType<typeof reducer>;

declare module 'react-redux' {
    interface DefaultRootState extends RootState {}
}

export const history = createBrowserHistory();

export default configureStore({ reducer });
