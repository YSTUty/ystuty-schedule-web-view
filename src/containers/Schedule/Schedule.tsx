import React from 'react';
import { Route } from 'react-router';

import LazyLoadComponent from '../../components/LazyLoad.component';
import TopPanelComponent from '../../components/TopPanel.component';

const ScheduleView = LazyLoadComponent(React.lazy(() => import('../ScheduleView/ScheduleView')));
const TeacherScheduleView = LazyLoadComponent(React.lazy(() => import('../TeacherScheduleView/TeacherScheduleView')));

const Schedule = () => {
    return (
        <>
            <TopPanelComponent />

            <hr />
            <Route strict path="/group" component={ScheduleView} />
            <Route strict path="/teacher" component={TeacherScheduleView} />
        </>
    );
};

export default Schedule;
