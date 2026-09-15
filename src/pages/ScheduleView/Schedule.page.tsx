import React from 'react';
import { useLocation } from 'react-router';

import TopPanelComponent from '@components/TopPanel.component';
import SchedulerContainer from '@/containers/Scheduler/Scheduler.container';
import { ScheduleFor } from '@/interfaces/ystuty.types';
import { useScheduleLoader } from './scheduleLoader.hook';

const SchedulePage = () => {
  const { pathname } = useLocation();

  const scheduleFor = React.useMemo<ScheduleFor | null>(() => {
    if (pathname.startsWith('/group')) {
      return 'group';
    }
    if (pathname.startsWith('/teacher')) {
      return 'teacher';
    }
    if (pathname.startsWith('/by_audience')) {
      return 'audience';
    }

    return null;
  }, [pathname]);

  const [, , isScheduleCached, isScheduleServerCached] = useScheduleLoader({
    scheduleFor,
  });

  return (
    <>
      <TopPanelComponent
        scheduleCached={isScheduleCached}
        scheduleServerCached={isScheduleServerCached}
        scheduleFor={scheduleFor}
      />
      <SchedulerContainer
        scheduleCached={isScheduleCached}
        scheduleServerCached={isScheduleServerCached}
        scheduleFor={scheduleFor}
      />
    </>
  );
};

export default SchedulePage;
