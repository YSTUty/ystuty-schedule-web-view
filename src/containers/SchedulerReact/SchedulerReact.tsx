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

const SchedulerReact = (props: { scheduleData: any[] }) => {
    const { scheduleData = [] } = props;
    const [events, setEvents] = React.useState<Event[]>([]);

    React.useEffect(() => {
        setEvents(
            scheduleData.map((e) => ({
                ...e,
                start: new Date(e.start),
                end: new Date(e.end),
            }))
        );
    }, [setEvents, scheduleData]);

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
