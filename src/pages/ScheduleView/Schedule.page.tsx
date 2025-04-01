import React from 'react';
import { useLocation } from 'react-router';

import TopPanelComponent from '../../components/TopPanel.component';
import SchedulerContainer from '../../containers/Scheduler/Scheduler.container';
import { useScheduleLoader } from './scheduleLoader.hook';
import { ScheduleFor } from '../../interfaces/ystuty.types';

const SchedulePage = () => {
    const { pathname } = useLocation();

    const [scheduleFor, setScheduleFor] = React.useState<ScheduleFor | null>(null);

    React.useEffect(() => {
        if (pathname.startsWith('/group')) {
            setScheduleFor('group');
        } else if (pathname.startsWith('/teacher')) {
            setScheduleFor('teacher');
        } else if (pathname.startsWith('/by_audience')) {
            setScheduleFor('audience');
        }
    }, [pathname, setScheduleFor]);

    useScheduleLoader({ scheduleFor });

    return (
        <>
            <TopPanelComponent scheduleFor={scheduleFor} />
            <SchedulerContainer scheduleFor={scheduleFor} />
        </>
    );
};

export default SchedulePage;
