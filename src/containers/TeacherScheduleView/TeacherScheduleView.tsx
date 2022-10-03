import MaterialTeacherContainer from '../Material/MaterialTeacher.container';
import { useTeacherScheduleLoader } from './teacherScheduleLoader.util';

const TeacherScheduleView = () => {
    useTeacherScheduleLoader();

    return (
        <>
            <MaterialTeacherContainer />
        </>
    );
};

export default TeacherScheduleView;
