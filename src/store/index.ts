import { combineReducers } from 'redux';
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { createBrowserHistory } from 'history';

import scheduleSlice from './reducer/schedule/schedule.slice';
import alertSlice from './reducer/alert/alert.slice';
import audiencerSlice from './reducer/audiencer/audiencer.slice';

export const reducer = combineReducers({
    schedule: scheduleSlice.reducer,
    alert: alertSlice.reducer,
    audiencer: audiencerSlice.reducer,
});

declare module 'react-redux' {
    interface DefaultRootState extends RootState {}
}

export const history = createBrowserHistory();

const store = configureStore({ reducer });
export default store;

export const dispatch = store.dispatch;

export type RootDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof reducer>;

type DispatchFunc = () => RootDispatch;
export const useAppDispatch: DispatchFunc = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
