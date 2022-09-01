import React from 'react';
import { useNetworkState } from 'react-use';
import store2 from 'store2';

import MaterialTeacherContainer from '../Material/MaterialTeacher.container';

import TopPanelComponent from '../../components/TopPanel.component';
import { useTeacherScheduleLoader } from './teacherScheduleLoader.util';

const BETA_CONFIRM_KEY = 'betaConfirm-teacher';

const TeacherScheduleView = () => {
    const state = useNetworkState();

    const [] = useTeacherScheduleLoader();

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
            {process.env.NODE_ENV === 'development' && !state.online && <pre>{JSON.stringify(state, null, 2)}</pre>}
            <TopPanelComponent forTeacher />

            <hr />
            <MaterialTeacherContainer />
        </>
    );
};

export default TeacherScheduleView;
