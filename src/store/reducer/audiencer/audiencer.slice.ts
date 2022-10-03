import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccumulativeSchedule, IAudienceData } from '../../../interfaces/ystuty.types';

const initialState = {
    audiences: [] as IAudienceData[],
    accumulatives: [] as AccumulativeSchedule[],
    selectedAudiences: [] as string[],
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
        setSelectedGroups: (state, action: PayloadAction<string[]>) => {
            state.selectedAudiences = action.payload;
        },
        clear: (state) => {
            state.audiences = [];
            state.accumulatives = [];
            state.selectedAudiences = [];
        },
    },
});

export default audiencerSlice;
