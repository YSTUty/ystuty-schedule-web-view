import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LessonFlags } from '../../../interfaces/ystuty.types';

const initialState = {
    selectedGroups: [] as string[],
    lessonTypes: [LessonFlags.Lecture, LessonFlags.Labaratory, LessonFlags.Practical, LessonFlags.CourseProject],
    lessonFilter: '',
};

export const scheduleSlice = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        toggleSelectedTypeLessons: (state, action: PayloadAction<LessonFlags>) => {
            const { lessonTypes } = state;
            const locationName = action.payload;

            if (lessonTypes.includes(locationName)) {
                state.lessonTypes = lessonTypes.filter((location) => location !== locationName);
                return;
            }
            lessonTypes.push(locationName);
        },
        updateLessonFilter: (state, action: PayloadAction<string>) => {
            state.lessonFilter = action.payload;
        },
        setSelected: (state, action: PayloadAction<string[]>) => {
            state.selectedGroups = action.payload;
        },
    },
});

export default scheduleSlice;
