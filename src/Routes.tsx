import * as React from 'react';
import { Route, Switch, Redirect } from 'react-router';
import LazyLoadComponent from './components/LazyLoad.component';

const App = LazyLoadComponent(React.lazy(() => import('./pages/Main/App.page')));
const Schedule = LazyLoadComponent(React.lazy(() => import('./pages/ScheduleView/Schedule.page')));
// const Audiencer = LazyLoadComponent(React.lazy(() => import('./containers/Audiencer/Audiencer')));
const TeacherLessons = LazyLoadComponent(React.lazy(() => import('./containers/TeacherLessons/TeacherLessons')));

export const Routes = () => {
    return (
        <Switch>
            <Route exact path="/" component={App} />
            <Route strict path="/(group|teacher|by_audience)" component={Schedule} />
            {/* <Route path="/audience" component={Audiencer} /> */}
            <Redirect path="/audience" to="/by_audience" />
            <Route path="/teacher-lessons" component={TeacherLessons} />
            <Route component={() => <b>not found</b>} />
        </Switch>
    );
};
