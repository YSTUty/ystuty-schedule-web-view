import React from 'react';
import FullCalendar, { EventApi, DateSelectArg, EventClickArg, EventContentArg, formatDate } from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import './Fullcalendar.css';

import { createEvent } from '../../utils/event.utils';

const useRenderSidebar = () => {
    const [weekendsVisible, setWeekendsVisible] = React.useState(true);
    const [currentEvents, setCurrentEvents] = React.useState<EventApi[]>([]);

    const handleWeekendsToggle = () => {
        setWeekendsVisible((state) => !state);
    };

    const renderSidebar = (
        <div className="app-sidebar">
            <div className="app-sidebar-section">
                <h2>Instructions</h2>
                <ul>
                    <li>Select dates and you will be prompted to create a new event</li>
                    <li>Drag, drop, and resize events</li>
                    <li>Click an event to delete it</li>
                </ul>
            </div>
            <div className="app-sidebar-section">
                <label>
                    <input type="checkbox" checked={weekendsVisible} onChange={handleWeekendsToggle}></input>
                    toggle weekends
                </label>
            </div>
            <div className="app-sidebar-section">
                <h2>All Events ({currentEvents.length})</h2>
                <ul>{currentEvents.map(renderSidebarEvent)}</ul>
            </div>
        </div>
    );
    return [renderSidebar, weekendsVisible, setCurrentEvents] as const;
};

const renderEventContent = (eventContent: EventContentArg) => {
    return (
        <>
            <b>{eventContent.timeText}</b>
            <i>{eventContent.event.title}</i>
        </>
    );
};

const renderSidebarEvent = (event: EventApi) => {
    return (
        <li key={event.id}>
            <b>{formatDate(event.start!, { year: 'numeric', month: 'short', day: 'numeric' })}</b>
            <i>{event.title}</i>
        </li>
    );
};

const FullcalendarContainer = (props: { scheduleData: any[] }) => {
    const { scheduleData } = props;
    const calendarRef = React.useRef<FullCalendar>();
    const [dataLoaded, setDataLoaded] = React.useState(false);

    const [renderSidebar, weekendsVisible, setCurrentEvents] = useRenderSidebar();

    const handleDateSelect = (selectInfo: DateSelectArg) => {
        let title = prompt('Please enter a new title for your event');
        let calendarApi = selectInfo.view.calendar;

        // clear date selection
        calendarApi.unselect();

        if (title) {
            calendarApi.addEvent(
                createEvent({
                    title,
                    start: selectInfo.startStr,
                    end: selectInfo.endStr,
                    allDay: selectInfo.allDay,
                })
            );
        }
    };

    const handleEventClick = (clickInfo: EventClickArg) => {
        if (window.confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
            clickInfo.event.remove();
        }
    };

    const handleEvents = (events: EventApi[]) => {
        setCurrentEvents(events);
    };

    const loadSchedule = React.useCallback(() => {
        calendarRef.current!.getApi().addEventSource(scheduleData);
        setDataLoaded(true);
    }, [calendarRef, setDataLoaded]);

    React.useEffect(() => {
        if (calendarRef.current /* && !dataLoaded */) {
            loadSchedule();
        }
    }, [calendarRef, loadSchedule, dataLoaded]);

    return (
        <div className="app">
            {renderSidebar}
            <div className="app-main">
                <FullCalendar
                    plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                    headerToolbar={{
                        left: 'prev,next today',
                        center: 'title',
                        right: 'dayGridMonth,timeGridWeek,timeGridDay',
                    }}
                    initialView="timeGridWeek"
                    // editable={true}
                    // selectable={true}
                    // selectMirror={true}
                    // dayMaxEvents={true}
                    weekends={weekendsVisible}
                    // // alternatively, use the `events` setting to fetch from a feed
                    // initialEvents={INITIAL_EVENTS}
                    select={handleDateSelect}
                    // custom render function
                    eventContent={renderEventContent}
                    eventClick={handleEventClick}
                    // called after events are initialized/added/changed/removed
                    eventsSet={handleEvents}
                    ref={calendarRef as any}
                    locale="ru"
                    firstDay={1}
                />
            </div>
        </div>
    );
};
export default FullcalendarContainer;
