import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AccumulativeSchedule, IAudienceData, LessonFlags } from '../../../interfaces/ystuty.types';

const initialState = {
    audiences: [] as IAudienceData[],
    accumulatives: [] as AccumulativeSchedule[],
    selectedAudiences: [] as string[],
    lessonTypes: [
        LessonFlags.Lecture,
        LessonFlags.Labaratory,
        LessonFlags.Practical,
        LessonFlags.CourseProject,
        LessonFlags.Consultation,
        LessonFlags.Test,
        LessonFlags.DifferentiatedTest,
        LessonFlags.Exam,
        LessonFlags.Library,
        LessonFlags.ResearchWork,
    ],
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
        toggleSelectedTypeLessons: (state, action: PayloadAction<LessonFlags>) => {
            const { lessonTypes } = state;
            const name = action.payload;

            if (lessonTypes.includes(name)) {
                state.lessonTypes = lessonTypes.filter((location) => location !== name);
                return;
            }
            lessonTypes.push(name);
        },
    },
});

export default audiencerSlice;
