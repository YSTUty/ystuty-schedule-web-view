import React from 'react';

import { LessonFlags, OneWeek } from '../../interfaces/ystuty.types';
import { apiPath, createEvent } from '../../utils';

export const useScheduleLoader = (setScheduleData: Function) => {
    const [fetching, setFetching] = React.useState(false);

    const loadSchedule = React.useCallback(
        (groupName: string) => {
            if (fetching) {
                return;
            }

            setScheduleData([]);
            setFetching(true);
            fetch(`${apiPath}/ystu/schedule/group/${groupName}`)
                .then((response) => response.json())
                .then(
                    (
                        response: { isCache: boolean; items: OneWeek[] } | { error: { error: string; message: string } }
                    ) => {
                        if ('error' in response) {
                            alert(response.error.message);
                            return;
                        }
                        const sources = response!.items.reduce(
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
                    }
                )
                .catch((e) => {
                    alert(e.message);
                })
                .finally(() => {
                    setFetching(false);
                });
        },
        [setScheduleData, fetching, setFetching]
    );

    return [loadSchedule] as const;
};
