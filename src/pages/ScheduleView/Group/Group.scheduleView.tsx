import { useScheduleLoader } from './group.scheduleLoader';
import SchedulerContainer from '../../../containers/Scheduler/Scheduler.container';

const GroupScheduleView = () => {
    useScheduleLoader();

    return <SchedulerContainer scheduleFor="group" />;
};

export default GroupScheduleView;
