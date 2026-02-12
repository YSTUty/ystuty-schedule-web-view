import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import store2 from 'store2';
import { useDebounce } from 'react-use';
import { toast } from 'react-toastify';
import { useIntl } from 'react-intl';

import alertSlice from '../../store/reducer/alert/alert.slice';
import scheduleSlice from '../../store/reducer/schedule/schedule.slice';
import { useApi } from '../../shared/api.hook';
import { delay } from '../../utils';

import { LessonData, LessonFlags, OneWeekDto } from '../../interfaces/schedule';
import { ITeacherData, ScheduleFor } from '../../interfaces/ystuty.types';

export const useScheduleLoader = (props: { scheduleFor: ScheduleFor | null }) => {
    const { scheduleFor } = props;

    const STORE_CACHED_OLD_KEYs =
        scheduleFor === 'group'
            ? ['CACHED_GROUP::', 'CACHED_V2_GROUP::']
            : scheduleFor === 'teacher'
              ? ['CACHED_TEACHER_LESSONS::', 'CACHED_V2_TEACHER_LESSONS::']
              : scheduleFor === 'audience'
                ? []
                : [];
    const STORE_CACHED_KEY =
        scheduleFor === 'group'
            ? 'CACHED_V3_GROUP::'
            : scheduleFor === 'teacher'
              ? 'CACHED_V3_TEACHER_LESSONS::'
              : scheduleFor === 'audience'
                ? 'CACHED_V1_AUDIENCE::'
                : null;

    // const { online } = useNetworkState();
    const dispatch = useDispatch();
    const { formatMessage } = useIntl();
    const selectedItems = useSelector((state) => (!scheduleFor ? [] : state.schedule.selectedItems[scheduleFor]));

    const [fetchApi, isFetching, isFetchings, abortControllers] = useApi();
    const [isCached, setIsCached] = React.useState(false);

    const [schedulesData, setSchedulesData] = React.useState<Record<string, { time: number; sources: LessonData[] }>>();

    const formatData = React.useCallback(
        (itemKey: string | number, items: OneWeekDto[] | null) => {
            if (!items) {
                const stored = STORE_CACHED_KEY && store2.get(STORE_CACHED_KEY + itemKey, null);
                items = stored?.items;
                if (!items) {
                    return;
                }
                setIsCached(true);
            } else if (items.length > 0 && STORE_CACHED_KEY) {
                store2.set(STORE_CACHED_KEY + itemKey, { time: Date.now(), items });
                setIsCached(false);
            }

            const sources = items.reduce<LessonData[]>(
                (prev, week) => [
                    ...prev,
                    ...week.days.flatMap((day) =>
                        day.lessons.map(
                            (lesson) =>
                                ({
                                    ...lesson,
                                    start: lesson.startAt!,
                                    end: lesson.endAt!,
                                    title: lesson.lessonName,
                                    typeArr: (Object.values(LessonFlags) as LessonFlags[]).filter(
                                        (e) => (lesson.type & e) === e && e !== LessonFlags.None,
                                    ),
                                }) as LessonData,
                        ),
                    ),
                ],
                [],
            );

            setSchedulesData((state) => ({
                ...state,
                [itemKey]: { time: items ? Date.now() : state?.[itemKey]?.time || 0, sources },
            }));
        },
        [setSchedulesData, setIsCached, STORE_CACHED_KEY],
    );

    const loadSchedule = React.useCallback(
        async (itemKey: string | number) => {
            if (schedulesData?.[itemKey] && Date.now() - schedulesData[itemKey].time < 30e3) {
                formatData(itemKey, null);
                return;
            }

            if (isFetchings[itemKey] || !scheduleFor) {
                return;
            }

            try {
                const response = await fetchApi<{
                    isCache: boolean;
                    items: OneWeekDto[];
                    teacher?: ITeacherData;
                }>(
                    `v1/schedule/${scheduleFor}/${itemKey}`,
                    {},
                    {
                        fKey: `${scheduleFor}/${itemKey}`,
                        fKeySub: `${scheduleFor}`,
                        setError: (error) =>
                            dispatch(
                                alertSlice.actions.add({
                                    message: `Error: ${error}`,
                                    severity: 'error',
                                }),
                            ),
                    },
                );

                if (!response || 'error' in response || !('data' in response)) {
                    return;
                }

                formatData(itemKey, response.data.items);
            } catch (err) {
                // ??
                formatData(itemKey, null);
                toast.warning('Ошибка загрузки актуального расписания');
                // if (online) {
                //     dispatch(
                //         alertSlice.actions.add({
                //             message: `Error: ${(err as Error).message}`,
                //             severity: 'error',
                //         }),
                //     );
                // }
            }
        },
        [isFetchings, scheduleFor, schedulesData, formatData /* online */],
    );

    useDebounce(
        () => {
            for (const val of selectedItems) {
                loadSchedule(val);
            }
            return () => {
                for (const abortController of Object.values(abortControllers.current)) {
                    abortController.abort();
                }
            };
        },
        500,
        [selectedItems],
    );

    const scheduleData = React.useMemo(
        () =>
            selectedItems
                .map((itemKey) => ({ itemKey, data: schedulesData?.[itemKey]?.sources! }))
                .filter((e) => !!e.data),
        [selectedItems, schedulesData],
    );

    React.useEffect(() => {
        if (scheduleFor) {
            dispatch(scheduleSlice.actions.setScheduleData({ scheduleFor, items: scheduleData }));
        }
    }, [scheduleFor, scheduleData]);

    React.useEffect(() => {
        dispatch(scheduleSlice.actions.setFetchingSchedule(isFetching));
    }, [isFetching]);

    // * clear local storage
    React.useEffect(() => {
        if (!STORE_CACHED_KEY) return;

        let index = 0;
        while (index < localStorage.length) {
            const key = localStorage.key(index);
            if (key === null) {
                break;
            }

            // remove old keys version
            if (STORE_CACHED_OLD_KEYs.some((e) => key.startsWith(e))) {
                localStorage.removeItem(key);
                --index;
            }

            // remove expired keys
            if (key.startsWith(STORE_CACHED_KEY)) {
                const { time } = store2.get(key, {});
                if (Date.now() - time > 24 * 60 * 60 * 1e3) {
                    localStorage.removeItem(key);
                    --index;
                }
            }
            ++index;
        }
    }, [STORE_CACHED_KEY, STORE_CACHED_OLD_KEYs]);

    return [scheduleData, isFetching, isCached] as const;
};
