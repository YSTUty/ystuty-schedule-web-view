import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccumulativeSchedule, IAudienceData } from '../../../interfaces/ystuty.types';

const initialState = {
    audiences: [] as IAudienceData[],
    accumulatives: [] as AccumulativeSchedule[],
};

export const audiencerSlice = createSlice({
    name: 'audiencer',
    initialState,
    reducers: {
        setAudiences: (state, action: PayloadAction<IAudienceData[]>) => {
            state.audiences = action.payload;
        },
        setAccumulative: (state, action: PayloadAction<AccumulativeSchedule[]>) => {
            state.accumulatives = action.payload;
        },
        clear: (state) => {
            state.audiences = [];
            state.accumulatives = [];
        },
    },
});

export default audiencerSlice;
