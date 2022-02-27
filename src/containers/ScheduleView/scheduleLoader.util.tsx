import React from 'react';
import store2 from 'store2';
import { useNetworkState } from 'react-use';

import { LessonFlags, OneWeek } from '../../interfaces/ystuty.types';
import { apiPath, createEvent } from '../../utils';

// TODO: add removing old cache
const STORE_CACHED_GROUP_KEY = 'CACHED_GROUP::';

export const useScheduleLoader = (setScheduleData: Function) => {
    const { online } = useNetworkState();
    const [fetching, setFetching] = React.useState(false);
    const [isCached, setIsCached] = React.useState(false);

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
                (prev: any[], week) => [
                    ...prev,
                    ...week.days.flatMap((day) =>
                        day.lessons.map((lesson) =>
                            createEvent({
                                ...lesson,
                                start: lesson.startAt,
                                end: lesson.endAt,
                                title: lesson.lessonName,
                                typeArr: Object.values(LessonFlags).filter(
                                    (e: any) => (lesson.type & e) === e && e !== LessonFlags.None
                                ),
                            })
                        )
                    ),
                ],
                []
            );

            setScheduleData(sources);
        },
        [setScheduleData, setIsCached]
    );

    const loadSchedule = React.useCallback(
        (groupName: string) => {
            if (fetching) {
                return;
            }

            setFetching(true);
            fetch(`${apiPath}/ystu/schedule/group/${groupName}`)
                .then((response) => response.json())
                .then(
                    (
                        response: { isCache: boolean; items: OneWeek[] } | { error: { error: string; message: string } }
                    ) => {
                        if ('error' in response) {
                            alert(`Error: ${response.error.message}`);
                            return;
                        }
                        formatData(groupName, response!.items);
                    }
                )
                .catch((e) => {
                    formatData(groupName, null);
                    if (online) {
                        alert(`Fail: ${e.message}`);
                    }
                })
                .finally(() => {
                    setFetching(false);
                });
        },
        [fetching, setFetching, formatData, online]
    );

    return [loadSchedule, fetching, isCached] as const;
};
