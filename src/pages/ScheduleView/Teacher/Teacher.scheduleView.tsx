import { useTeacherScheduleLoader } from './teacher.scheduleLoader';
import SchedulerContainer from '../../../containers/Scheduler/Scheduler.container';

const TeacherScheduleView = () => {
    useTeacherScheduleLoader();

    return <SchedulerContainer scheduleFor="teacher" />;
};

export default TeacherScheduleView;
