import TeacherScheduler from '../../../containers/MaterialScheduler/Teacher.scheduler';
import { useTeacherScheduleLoader } from './teacher.scheduleLoader';

const TeacherScheduleView = () => {
    useTeacherScheduleLoader();

    return (
        <>
            <TeacherScheduler />
        </>
    );
};

export default TeacherScheduleView;
