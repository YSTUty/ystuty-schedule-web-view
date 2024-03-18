import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import store2 from 'store2';

import alertSlice from '../../store/reducer/alert/alert.slice';
import scheduleSlice from '../../store/reducer/schedule/schedule.slice';
import { apiPath } from '../../utils';

import { LessonFlags, OneWeekDto, LessonData } from '../../interfaces/schedule';
import { ITeacherData } from '../../interfaces/ystuty.types';

const STORE_CACHED_TEACHER_KEY_OLD = 'CACHED_TEACHER_LESSONS::';
const STORE_CACHED_TEACHER_KEY = 'CACHED_V2_TEACHER_LESSONS::';

export const useTeacherScheduleLoader = () => {
    const dispatch = useDispatch();
    const { selectedTeachers } = useSelector((state) => state.schedule);

    const [fetchings, setFetchings] = React.useState<Record<number, boolean>>({});
    const [isCached, setIsCached] = React.useState(false);

    const [schedulesData, setSchedulesData] =
        React.useState<Record<string, { time: number; sources: LessonData[] }>>();

    const formatData = React.useCallback(
        (teacherId: number, items: OneWeekDto[] | null) => {
            if (!items) {
                const stored = store2.get(STORE_CACHED_TEACHER_KEY + teacherId, null);
                items = stored?.items;
                if (!items) {
                    return;
                }
                setIsCached(true);
            } else if (items.length > 0) {
                store2.set(STORE_CACHED_TEACHER_KEY + teacherId, { time: Date.now(), items });
                setIsCached(false);
            }

            const sources = items.reduce(
                (prev, week) => [
                    ...prev,
                    ...week.days.flatMap((day) =>
                        day.lessons.map((lesson) => ({
                            ...lesson,
                            start: lesson.startAt!,
                            end: lesson.endAt!,
                            title: lesson.lessonName!,
                            typeArr: (Object.values(LessonFlags) as LessonFlags[]).filter(
                                (e) => (lesson.type & e) === e && e !== LessonFlags.None,
                            ),
                        })),
                    ),
                ],
                [] as LessonData[],
            );

            setSchedulesData((state) => ({ ...state, [teacherId]: { time: Date.now(), sources } }));
        },
        [setSchedulesData, setIsCached],
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
            fetch(`${apiPath}/v1/schedule/teacher/${teacherId}`)
                .then((response) => response.json())
                .then(
                    (
                        response:
                            | {
                                  isCache: boolean;
                                  teacher: ITeacherData;
                                  items: OneWeekDto[];
                              }
                            | { error: { error: string; message: string } },
                    ) => {
                        if ('error' in response) {
                            dispatch(
                                alertSlice.actions.add({
                                    message: `Error: ${response.error.message}`,
                                    severity: 'error',
                                }),
                            );
                            return;
                        }
                        formatData(teacherId, response!.items);
                    },
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
        [schedulesData, fetchings, setFetchings, formatData /* online */],
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
        [selectedTeachers, schedulesData],
    );

    const isFetching = React.useMemo(() => Object.values(fetchings).some((e) => e), [fetchings]);

    React.useEffect(() => {
        dispatch(scheduleSlice.actions.setTeacherScheduleData(scheduleData));
    }, [scheduleData]);
    React.useEffect(() => {
        dispatch(scheduleSlice.actions.setFetchingSchedule(isFetching));
    }, [isFetching]);

    // * clear local storage
    React.useEffect(() => {
        let index = 0;
        while (index < localStorage.length) {
            const key = localStorage.key(index);
            if (key === null) {
                break;
            }

            // remove old keys version
            if (key.startsWith(STORE_CACHED_TEACHER_KEY_OLD)) {
                localStorage.removeItem(key);
            }

            // remove expired keys
            if (key.startsWith(STORE_CACHED_TEACHER_KEY)) {
                const { time } = store2.get(key, {});
                if (Date.now() - time > 24 * 60 * 60 * 1e3) {
                    localStorage.removeItem(key);
                }
            }
            ++index;
        }
    }, []);

    return [scheduleData, isFetching, isCached] as const;
};
