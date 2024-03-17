import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import store2 from 'store2';

import { LessonData, LessonFlags, TeacherLessonData } from '../../../interfaces/schedule';

export const STORE_GROUP_NAME_KEY = 'lastGroupName';
export const STORE_TEACHER_NAME_KEY = 'lastTeacherName';
export const STORE_ALLOW_MULTIPLE_GROUP_KEY = 'allowMultipleGroup';
export const STORE_ALLOW_MULTIPLE_TEACHERS_KEY = 'allowMultipleTeachers';

export const getLastGroups = () => store2.get(STORE_GROUP_NAME_KEY, []) as string[];
export const getLastTeachers = () => store2.get(STORE_TEACHER_NAME_KEY, []) as number[];

export const LAST_GROUPS = getLastGroups();
export const LAST_TEACHER_IDS = getLastTeachers();
export const DEFAULT_ALLOW_MULTIPLE_GROUP: boolean = !!store2.get(STORE_ALLOW_MULTIPLE_GROUP_KEY, false);
export const DEFAULT_ALLOW_MULTIPLE_TEACHERS: boolean = !!store2.get(STORE_ALLOW_MULTIPLE_TEACHERS_KEY, false);

const initialState = {
    selectedGroups: LAST_GROUPS,
    selectedTeachers: LAST_TEACHER_IDS,
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
    lessonFilter: '',
    groupsSplitColor: true,
    groupingGroups: false,
    isGroupByDate: true,
    fetchingSchedule: false,
    allowedMultipleGroups: DEFAULT_ALLOW_MULTIPLE_GROUP,
    allowedMultipleTeachers: DEFAULT_ALLOW_MULTIPLE_TEACHERS,
    studScheduleData: [] as {
        name: string;
        data: LessonData[];
    }[],
    teacherScheduleData: [] as {
        teacherId: number;
        data: TeacherLessonData[];
    }[],
    allowedLessonTypes: [] as LessonFlags[],
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
        setSelectedGroups: (state, action: PayloadAction<string[]>) => {
            state.selectedGroups = action.payload;
        },
        setSelectedTeachers: (state, action: PayloadAction<number /* ITeacherData */[]>) => {
            state.selectedTeachers = action.payload;
        },
        onGroupOrderToggle: (state, action: PayloadAction<boolean | undefined>) => {
            state.isGroupByDate = action.payload ?? !state.isGroupByDate;
        },
        groupsSplitColorToggle: (state, action: PayloadAction<boolean | undefined>) => {
            state.groupsSplitColor = action.payload ?? !state.groupsSplitColor;
        },
        groupingGroupsToggle: (state, action: PayloadAction<boolean | undefined>) => {
            state.groupingGroups = action.payload ?? !state.groupingGroups;
        },
        setFetchingSchedule: (state, action: PayloadAction<boolean>) => {
            state.fetchingSchedule = action.payload;
        },
        setAllowedLessonTypes: (state, action: PayloadAction<LessonFlags[]>) => {
            state.allowedLessonTypes = action.payload;
        },
        setAllowedMultipleGroup: (state, action: PayloadAction<boolean>) => {
            store2.set(STORE_ALLOW_MULTIPLE_GROUP_KEY, action.payload);
            state.allowedMultipleGroups = action.payload;
        },
        setAllowedMultipleTeachers: (state, action: PayloadAction<boolean>) => {
            store2.set(STORE_ALLOW_MULTIPLE_TEACHERS_KEY, action.payload);
            state.allowedMultipleTeachers = action.payload;
        },
        setStudScheduleData: (state, action: PayloadAction<{ name: string; data: LessonData[] }[]>) => {
            state.studScheduleData = action.payload;
        },
        setTeacherScheduleData: (state, action: PayloadAction<{ teacherId: number; data: TeacherLessonData[] }[]>) => {
            state.teacherScheduleData = action.payload;
        },
    },
});

export default scheduleSlice;
