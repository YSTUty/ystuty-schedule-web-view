import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import store2 from 'store2';

import { LessonData, LessonFlags } from '../../../interfaces/schedule';
import { ScheduleFor } from '../../../interfaces/ystuty.types';

export const STORE_GROUP_NAME_KEY = 'lastGroupName';
export const STORE_TEACHER_NAME_KEY = 'lastTeacherName';
export const STORE_AUDIENCE_NAME_KEY = 'lastAudienceName';

export const STORE_ALLOW_MULTIPLE_GROUP_KEY = 'allowMultipleGroup';
export const STORE_ALLOW_MULTIPLE_TEACHERS_KEY = 'allowMultipleTeachers';
export const STORE_ALLOW_MULTIPLE_AUDIENCES_KEY = 'allowMultipleAudiences';

export const getLastGroups = () => store2.get(STORE_GROUP_NAME_KEY, []) as string[];
export const getLastTeachers = () => store2.get(STORE_TEACHER_NAME_KEY, []) as number[];
export const getLastAudiences = () => store2.get(STORE_AUDIENCE_NAME_KEY, []) as number[];

export const DEFAULT_ALLOW_MULTIPLE_GROUP = !!store2.get(STORE_ALLOW_MULTIPLE_GROUP_KEY, false);
export const DEFAULT_ALLOW_MULTIPLE_TEACHERS = !!store2.get(STORE_ALLOW_MULTIPLE_TEACHERS_KEY, false);
export const DEFAULT_ALLOW_MULTIPLE_AUDIENCES = !!store2.get(STORE_ALLOW_MULTIPLE_AUDIENCES_KEY, false);

export const LAST_GROUPS = getLastGroups();
export const LAST_TEACHER_IDS = getLastTeachers();
export const LAST_AUDIENCES = getLastAudiences();

const initialState = {
    selectedItems: {
        group: LAST_GROUPS,
        teacher: LAST_TEACHER_IDS,
        audience: LAST_AUDIENCES,
    } as Record<ScheduleFor, (string | number)[]>,
    allowedMultiple: {
        group: DEFAULT_ALLOW_MULTIPLE_GROUP,
        teacher: DEFAULT_ALLOW_MULTIPLE_TEACHERS,
        audience: DEFAULT_ALLOW_MULTIPLE_AUDIENCES,
    } as Record<ScheduleFor, boolean>,
    scheduleData: {} as Partial<
        Record<
            ScheduleFor,
            {
                itemKey: string | number;
                data: LessonData[];
            }[]
        >
    >,
    fetchingSchedule: false,
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
        LessonFlags.OrganizationalMeeting,
        LessonFlags.Unsupported,
    ],
    allowedLessonTypes: [] as LessonFlags[],
    lessonFilter: '',
    groupsSplitColor: true,
    groupingGroups: false,
    isGroupByDate: true,
};

export const scheduleSlice = createSlice({
    name: 'schedule',
    initialState,
    reducers: {
        setSelectedItems: (
            state,
            action: PayloadAction<{
                scheduleFor: ScheduleFor;
                items: (string | number)[];
            }>,
        ) => {
            state.selectedItems[action.payload.scheduleFor] = action.payload.items;
        },
        setAllowedMultiple: (
            state,
            action: PayloadAction<{
                scheduleFor: ScheduleFor;
                allowed: boolean;
            }>,
        ) => {
            const { scheduleFor, allowed } = action.payload;
            state.allowedMultiple[scheduleFor] = allowed;
            store2.set(
                scheduleFor === 'group'
                    ? STORE_ALLOW_MULTIPLE_GROUP_KEY
                    : scheduleFor === 'teacher'
                      ? STORE_ALLOW_MULTIPLE_TEACHERS_KEY
                      : STORE_ALLOW_MULTIPLE_AUDIENCES_KEY,
                allowed,
            );
        },
        setScheduleData: (
            state,
            action: PayloadAction<{
                scheduleFor: ScheduleFor;
                items: { itemKey: string | number; data: LessonData[] }[];
            }>,
        ) => {
            state.scheduleData[action.payload.scheduleFor] = action.payload.items;
        },
        setFetchingSchedule: (state, action: PayloadAction<boolean>) => {
            state.fetchingSchedule = action.payload;
        },
        toggleSelectedTypeLessons: (state, action: PayloadAction<LessonFlags>) => {
            const { lessonTypes } = state;
            const lessonFlag = action.payload;

            if (lessonTypes.includes(lessonFlag)) {
                state.lessonTypes = lessonTypes.filter((flag) => flag !== lessonFlag);
                return;
            }
            lessonTypes.push(lessonFlag);
        },
        setAllowedLessonTypes: (state, action: PayloadAction<LessonFlags[]>) => {
            state.allowedLessonTypes = action.payload;
        },
        updateLessonFilter: (state, action: PayloadAction<string>) => {
            state.lessonFilter = action.payload;
        },
        groupsSplitColorToggle: (state, action: PayloadAction<boolean | undefined>) => {
            state.groupsSplitColor = action.payload ?? !state.groupsSplitColor;
        },
        groupingGroupsToggle: (state, action: PayloadAction<boolean | undefined>) => {
            state.groupingGroups = action.payload ?? !state.groupingGroups;
        },
        onGroupOrderToggle: (state, action: PayloadAction<boolean | undefined>) => {
            state.isGroupByDate = action.payload ?? !state.isGroupByDate;
        },
    },
});

export default scheduleSlice;
