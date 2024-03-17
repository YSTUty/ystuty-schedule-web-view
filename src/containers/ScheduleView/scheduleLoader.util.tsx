import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import store2 from 'store2';
// import { useNetworkState } from 'react-use';

import alertSlice from '../../store/reducer/alert/alert.slice';
import scheduleSlice from '../../store/reducer/schedule/schedule.slice';
import { apiPath } from '../../utils';

import { LessonData, LessonFlags, OneWeekDto } from '../../interfaces/schedule';

const STORE_CACHED_GROUP_KEY_OLD = 'CACHED_GROUP::';
const STORE_CACHED_GROUP_KEY = 'CACHED_V2_GROUP::';

export const useScheduleLoader = () => {
    // const { online } = useNetworkState();
    const dispatch = useDispatch();
    const { selectedGroups } = useSelector((state) => state.schedule);

    const [fetchings, setFetchings] = React.useState<Record<string, boolean>>({});
    const [isCached, setIsCached] = React.useState(false);

    const [schedulesData, setSchedulesData] = React.useState<Record<string, { time: number; sources: LessonData[] }>>();

    const formatData = React.useCallback(
        (name: string, items: OneWeekDto[] | null) => {
            if (!items) {
                const stored = store2.get(STORE_CACHED_GROUP_KEY + name, null);
                items = stored?.items;
                if (!items) {
                    return;
                }
                setIsCached(true);
            } else if (items.length > 0) {
                store2.set(STORE_CACHED_GROUP_KEY + name, { time: Date.now(), items });
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

            setSchedulesData((state) => ({ ...state, [name]: { time: Date.now(), sources } }));
        },
        [setSchedulesData, setIsCached],
    );

    const loadSchedule = React.useCallback(
        (name: string) => {
            if (schedulesData?.[name] && Date.now() - schedulesData[name].time < 60e3) {
                formatData(name, null);
                return;
            }

            if (fetchings[name]) {
                return;
            }

            setFetchings((s) => ({ ...s, [name]: true }));
            fetch(`${apiPath}/v1/schedule/group/${name}`)
                .then((response) => response.json())
                .then(
                    (
                        response:
                            | { isCache: boolean; items: OneWeekDto[] }
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
                        formatData(name, response!.items);
                    },
                )
                .catch((e) => {
                    console.log(e);

                    formatData(name, null);
                    // if (online) {
                    //     alert(`Fail: ${e.message}`);
                    // }
                })
                .finally(() => {
                    setFetchings((s) => ({ ...s, [name]: false }));
                });
        },
        [schedulesData, fetchings, setFetchings, formatData /* online */],
    );

    React.useEffect(() => {
        for (const name of selectedGroups) {
            loadSchedule(name);
        }
    }, [selectedGroups]);

    const scheduleData = React.useMemo(
        () => selectedGroups.map((name) => ({ name, data: schedulesData?.[name]?.sources! })).filter((e) => !!e.data),
        [selectedGroups, schedulesData],
    );

    const isFetching = React.useMemo(() => Object.values(fetchings).some((e) => e), [fetchings]);

    React.useEffect(() => {
        dispatch(scheduleSlice.actions.setStudScheduleData(scheduleData));
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
            if (key.startsWith(STORE_CACHED_GROUP_KEY_OLD)) {
                localStorage.removeItem(key);
            }

            // remove expired keys
            if (key.startsWith(STORE_CACHED_GROUP_KEY)) {
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
