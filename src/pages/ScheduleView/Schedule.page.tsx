import React from 'react';
import { Route } from 'react-router';

import LazyLoadComponent from '../../components/LazyLoad.component';
import TopPanelComponent from '../../components/TopPanel.component';

const GroupScheduleView = LazyLoadComponent(React.lazy(() => import('./Group/Group.scheduleView')));
const TeacherScheduleView = LazyLoadComponent(React.lazy(() => import('./Teacher/Teacher.scheduleView')));

const SchedulePage = () => {
    return (
        <>
            <TopPanelComponent />

            <Route strict path="/group" component={GroupScheduleView} />
            <Route strict path="/teacher" component={TeacherScheduleView} />
        </>
    );
};

export default SchedulePage;
