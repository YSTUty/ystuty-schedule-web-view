import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import store2 from 'store2';
// import { useNetworkState } from 'react-use';

import { LessonData, LessonFlags, OneWeek } from '../../interfaces/ystuty.types';
import alertSlice from '../../store/reducer/alert/alert.slice';
import { apiPath, createEvent } from '../../utils';

// TODO: add removing old cache
const STORE_CACHED_GROUP_KEY = 'CACHED_GROUP::';

export const useScheduleLoader = () => {
    // const { online } = useNetworkState();
    const dispatch = useDispatch();
    const { selectedGroups } = useSelector((state) => state.schedule);

    const [fetchings, setFetchings] = React.useState<Record<string, boolean>>({});
    const [isCached, setIsCached] = React.useState(false);

    const [schedulesData, setSchedulesData] = React.useState<Record<string, { time: number; sources: LessonData[] }>>();

    const formatData = React.useCallback(
        (name: string, items: OneWeek[] | null) => {
            if (!items) {
                items = store2.get(STORE_CACHED_GROUP_KEY + name, null);
                if (!items) {
                    return;
                }
                setIsCached(true);
            } else if (items.length > 0) {
                store2.set(STORE_CACHED_GROUP_KEY + name, items);
                setIsCached(false);
            }

            const sources = items.reduce(
                (prev, week) => [
                    ...prev,
                    ...week.days.flatMap((day) =>
                        day.lessons.map((lesson) =>
                            createEvent<LessonData>({
                                ...lesson,
                                start: lesson.startAt!,
                                end: lesson.endAt!,
                                title: lesson.lessonName!,
                                typeArr: (Object.values(LessonFlags) as LessonFlags[]).filter(
                                    (e) => (lesson.type & e) === e && e !== LessonFlags.None
                                ),
                            })
                        )
                    ),
                ],
                [] as LessonData[]
            );

            setSchedulesData((state) => ({ ...state, [name]: { time: Date.now(), sources } }));
        },
        [setSchedulesData, setIsCached]
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
            fetch(`${apiPath}/ystu/schedule/group/${name}`)
                .then((response) => response.json())
                .then(
                    (
                        response: { isCache: boolean; items: OneWeek[] } | { error: { error: string; message: string } }
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
                        formatData(name, response!.items);
                    }
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
        [schedulesData, fetchings, setFetchings, formatData /* online */]
    );

    React.useEffect(() => {
        for (const name of selectedGroups) {
            loadSchedule(name);
        }
    }, [selectedGroups]);

    const scheduleData = React.useMemo(
        () => selectedGroups.map((name) => ({ name, data: schedulesData?.[name]?.sources! })).filter((e) => !!e.data),
        [selectedGroups, schedulesData]
    );

    const isFetching = React.useMemo(() => Object.values(fetchings).some((e) => e), [fetchings]);

    return [scheduleData, isFetching, isCached] as const;
};
