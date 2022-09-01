import React from 'react';
import { Calendar, dateFnsLocalizer, Event } from 'react-big-calendar';

import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import ruRU from 'date-fns/locale/ru';

import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';

import { apiPath } from '../../utils';
import { LessonFlags } from '../../interfaces/ystuty.types';
import * as lessonsUtils from '../../utils/lessons.utils';

// type TeacherDayType = {
//     weekName: string;
//     weekType: number;
//     weekNumber: number;
//     date: string;
//     dateStr: string;
//     time: string;
//     groups: string[];
//     lessonName: string;
//     lessonType: number;
//     auditoryName: string;
// };
type TeacherDayType = {
    /**
     * Порядковый номер пары на дню
     */
    number: number;
    /**
     * Временной интервал пары
     */
    timeRange: string;
    /**
     * Timestamp начала пары
     */
    startAt: string;
    /**
     * Timestamp конца пары
     */
    endAt: string;
    /**
     * Пара дистанционно
     */
    // isDistant?: boolean;
    isDistant?: true;
    /**
     * Название предмета пары
     */
    lessonName: string;
    /**
     * Флаг типа пары
     */
    lessonType: LessonFlags;
    auditoryName?: string;
    /**
     * Названия групп
     */
    groups: string[];
};

const SchedulerReact = (props: { scheduleData?: any[] }) => {
    // const { scheduleData = [] } = props;
    const [events, setEvents] = React.useState<Event[]>([]);
    const [fetchings, setFetchings] = React.useState<Record<string, boolean>>({});

    const formatData = React.useCallback(
        (name: string, items: TeacherDayType[] | null) => {
            if (!items) {
                return;
            }

            // const sources = items.reduce(
            //     (prev, week) => [
            //         ...prev,
            //         ...week.days.flatMap((day) =>
            //             day.lessons.map((lesson) =>
            //                 createEvent<LessonData>({
            //                     ...lesson,
            //                     start: lesson.startAt!,
            //                     end: lesson.endAt!,
            //                     title: lesson.lessonName!,
            //                     typeArr: (Object.values(LessonFlags) as LessonFlags[]).filter(
            //                         (e) => (lesson.type & e) === e && e !== LessonFlags.None
            //                     ),
            //                 })
            //             )
            //         ),
            //     ],
            //     []
            // );

            setEvents(
                items.map((e) => ({
                    title: `[${e.groups.join(',')}] ${e.auditoryName}\n${e.lessonName}\nВид занятий: ${lessonsUtils
                        .getLessonTypeStrArr(e.lessonType)
                        .join(', ')}`,
                    start: new Date(e.startAt),
                    end: new Date(e.endAt),
                    // end: new Date(new Date(e.startAt).getTime() + 180 * 60e3),
                }))
            );
            // setSchedulesData((state) => ({ ...state, [name]: { time: Date.now(), sources } }));
        },
        [setEvents]
    );

    const loadSchedule = React.useCallback(
        (name: string) => {
            if (fetchings[name]) {
                return;
            }

            setFetchings((s) => ({ ...s, [name]: true }));
            fetch(`${apiPath}/ystu/schedule/teacher/${name}`)
                .then((response) => response.json())
                .then((response: { teacher: any; items: any[] } | { error: { error: string; message: string } }) => {
                    if ('error' in response) {
                        console.log(response.error);
                        // dispatch(
                        //     alertSlice.actions.add({
                        //         message: `Error: ${response.error.message}`,
                        //         severity: 'error',
                        //     })
                        // );
                        return;
                    }
                    formatData(name, response!.items);
                })
                .catch((e) => {
                    console.log(e);

                    // formatData(name, null);
                })
                .finally(() => {
                    setFetchings((s) => ({ ...s, [name]: false }));
                });
        },
        [fetchings, setFetchings, formatData]
    );

    React.useEffect(() => {
        loadSchedule('1028');
    }, []);

    // React.useEffect(() => {
    //     setEvents(
    //         scheduleData.map((e) => ({
    //             ...e,
    //             start: new Date(e.start),
    //             end: new Date(e.end),
    //         }))
    //     );
    // }, [setEvents, scheduleData]);

    return (
        <Calendar
            defaultView="week"
            events={events}
            localizer={localizer}
            culture="ru-RU"
            // style={{ height: '100vh' }}
        />
    );
};

const locales = {
    'en-US': enUS,
    'ru-RU': ruRU,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

export default SchedulerReact;
