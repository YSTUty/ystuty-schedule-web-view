import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import store2 from 'store2';

import { TeacherLessonData, LessonFlags, TeacherDayType } from '../../interfaces/ystuty.types';
import alertSlice from '../../store/reducer/alert/alert.slice';
import scheduleSlice from '../../store/reducer/schedule/schedule.slice';
import { apiPath, createEvent } from '../../utils';

// TODO: add removing old cache
const STORE_CACHED_TEACHER_KEY = 'CACHED_TEACHER_LESSONS::';

export const useTeacherScheduleLoader = () => {
    const dispatch = useDispatch();
    const { selectedTeachers } = useSelector((state) => state.schedule);

    const [fetchings, setFetchings] = React.useState<Record<number, boolean>>({});
    const [isCached, setIsCached] = React.useState(false);

    const [schedulesData, setSchedulesData] =
        React.useState<Record<string, { time: number; sources: TeacherLessonData[] }>>();

    const formatData = React.useCallback(
        (teacherId: number, items: TeacherDayType[] | null) => {
            if (!items) {
                items = store2.get(STORE_CACHED_TEACHER_KEY + teacherId, null);
                if (!items) {
                    return;
                }
                setIsCached(true);
            } else if (items.length > 0) {
                store2.set(STORE_CACHED_TEACHER_KEY + teacherId, items);
                setIsCached(false);
            }

            const sources = items.map((lesson) =>
                createEvent<TeacherLessonData>({
                    ...lesson,
                    start: lesson.startAt!,
                    end: lesson.endAt!,
                    title: lesson.lessonName!,
                    typeArr: (Object.values(LessonFlags) as LessonFlags[]).filter(
                        (e) => (lesson.lessonType & e) === e && e !== LessonFlags.None
                    ),
                })
            );

            setSchedulesData((state) => ({ ...state, [teacherId]: { time: Date.now(), sources } }));
        },
        [setSchedulesData, setIsCached]
    );

    const loadSchedule = React.useCallback(
        (teacherId: number) => {
            if (schedulesData?.[teacherId] && Date.now() - schedulesData[teacherId].time < 60e3) {
                formatData(teacherId, null);
                return;
            }

            if (fetchings[teacherId]) {
                return;
            }

            setFetchings((s) => ({ ...s, [teacherId]: true }));
            fetch(`${apiPath}/ystu/schedule/teacher/${teacherId}`)
                .then((response) => response.json())
                .then(
                    (
                        response:
                            | { isCache: boolean; teacher: any; items: any[] }
                            | { error: { error: string; message: string } }
                    ) => {
                        if ('error' in response) {
                            dispatch(
                                alertSlice.actions.add({
                                    message: `Error: ${response.error.message}`,
                                    severity: 'error',
                                })
                            );
                            return;
                        }
                        formatData(teacherId, response!.items);
                    }
                )
                .catch((e) => {
                    console.log(e);

                    formatData(teacherId, null);
                    // if (online) {
                    //     alert(`Fail: ${e.message}`);
                    // }
                })
                .finally(() => {
                    setFetchings((s) => ({ ...s, [teacherId]: false }));
                });
        },
        [schedulesData, fetchings, setFetchings, formatData /* online */]
    );

    React.useEffect(() => {
        for (const teacherId of selectedTeachers) {
            loadSchedule(teacherId);
        }
    }, [selectedTeachers]);

    const scheduleData = React.useMemo(
        () =>
            selectedTeachers
                .map((teacherId) => ({ teacherId, data: schedulesData?.[teacherId]?.sources! }))
                .filter((e) => !!e.data),
        [selectedTeachers, schedulesData]
    );

    const isFetching = React.useMemo(() => Object.values(fetchings).some((e) => e), [fetchings]);

    React.useEffect(() => {
        dispatch(scheduleSlice.actions.setTeacherScheduleData(scheduleData));
    }, [scheduleData]);
    React.useEffect(() => {
        dispatch(scheduleSlice.actions.setFetchingSchedule(isFetching));
    }, [isFetching]);

    return [scheduleData, isFetching, isCached] as const;
};
