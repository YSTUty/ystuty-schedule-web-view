import * as React from 'react';
import { Navigate, Route, Routes as RouterRoutes } from 'react-router';

import LazyLoadComponent from './components/LazyLoad.component';
import NotFoundPage from './pages/NotFound/NotFound.page';

const App = LazyLoadComponent(
  React.lazy(() => import('./pages/Main/App.page')),
);
const Schedule = LazyLoadComponent(
  React.lazy(() => import('./pages/ScheduleView/Schedule.page')),
);
// const Audiencer = LazyLoadComponent(React.lazy(() => import('./containers/Audiencer/Audiencer')));
const TeacherLessons = LazyLoadComponent(
  React.lazy(() => import('./containers/TeacherLessons/TeacherLessons')),
);

export const Routes = () => {
  return (
    <RouterRoutes>
      <Route path="/" element={<App />} />
      <Route path="/group/:selectedItems?" element={<Schedule />} />
      <Route path="/teacher/:selectedItems?" element={<Schedule />} />
      <Route path="/by_audience/:selectedItems?" element={<Schedule />} />
      {/* <Route path="/audience" component={Audiencer} /> */}
      <Route
        path="/audience/*"
        element={<Navigate replace to="/by_audience" />}
      />
      <Route
        path="/teacher-lessons/:selectedItems?"
        element={<TeacherLessons />}
      />
      <Route path="*" element={<NotFoundPage />} />
    </RouterRoutes>
  );
};
