import dayjs, { Dayjs } from 'dayjs';

export const fixAudienceName = <T extends { name: string }>({ name, ...e }: T) => ({
    ...e,
    name: name === 'Актовый зал' ? 'А-АктовыйЗал' : name === 'В-корпус_библиотека' ? 'В-Библиотека' : name,
});

export const filterByDateTime =
    <T extends { items: { startAt: string | Date; endAt: string | Date }[] }>(filterDateTime: {
        date1: Dayjs | null;
        date2: Dayjs | null;
        time1: Dayjs | null;
        time2: Dayjs | null;
    }) =>
    (audience: T) => {
        const { date1, date2, time1, time2 } = filterDateTime;
        let { items } = audience;
        if (date1 || date2 || time1 || time2) {
            items = items.filter((l) => {
                const startAt = dayjs(l.startAt);
                const endAt = dayjs(l.endAt);
                const startDate = startAt.startOf('day');
                const startTime = dayjs(startAt.get('hour') + ':' + startAt.get('m'), 'HH:mm');
                const endTime = dayjs(endAt.get('hour') + ':' + endAt.get('m'), 'HH:mm');

                return ![
                    date1 && !startDate.isSameOrAfter(date1),
                    date2 && !startDate.isSameOrBefore(date2),
                    time1 && !startTime.isSameOrAfter(time1),
                    time2 && !endTime.isSameOrBefore(time2),
                ].some((e) => !!e);
            });
        }
        return { ...audience, items };
    };

export const filterByLessonArray = <
    T extends {
        items: {
            lessonName?: string;
            teacherName?: string;
            groups?: string[];
        }[];
    },
>(
    filterLessonVal: string,
) => {
    const filterLessonArr = filterLessonVal
        .toLowerCase()
        .split(',')
        .map((item) => item.trim());
    return (e: T) => ({
        ...e,
        items:
            filterLessonArr.length === 0
                ? e.items
                : e.items.filter((item) =>
                      filterLessonArr.some(
                          (e) =>
                              // item.lessonName?.toLowerCase().includes(e)
                              item.lessonName?.toLowerCase()?.includes(e) ||
                              item.teacherName?.toLowerCase()?.includes(e) ||
                              item.groups?.join(', ')?.toLowerCase()?.includes(e),
                      ),
                  ),
    });
};
