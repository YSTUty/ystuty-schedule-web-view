import React from 'react';
import store2 from 'store2';

import MaterialTeacherContainer from '../Material/MaterialTeacher.container';
import { useTeacherScheduleLoader } from './teacherScheduleLoader.util';

const BETA_CONFIRM_KEY = 'betaConfirm-teacher';

const TeacherScheduleView = () => {
    useTeacherScheduleLoader();

    React.useEffect(() => {
        const isConfirmed = store2.get(BETA_CONFIRM_KEY, false);
        if (!isConfirmed) {
            const confirm = window.confirm(
                'Сайт находится в Beta версии!\n\nДанные могут быть некорректны...\nПродолжить?'
            );
            store2.set(BETA_CONFIRM_KEY, confirm);
        }
    }, []);

    return (
        <>
            <MaterialTeacherContainer />
        </>
    );
};

export default TeacherScheduleView;
