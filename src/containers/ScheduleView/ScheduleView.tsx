import React from 'react';
import store2 from 'store2';

import MaterialContainer from '../Material/Material';
import { useScheduleLoader } from './scheduleLoader.util';

const BETA_CONFIRM_KEY = 'betaConfirm';

const ScheduleView = () => {
    useScheduleLoader();

    React.useEffect(() => {
        const isConfirmed = store2.get(BETA_CONFIRM_KEY, false);
        if (!isConfirmed) {
            // const confirm = window.confirm(
            //     'Сайт находится в Альфа версии!\n\nДанные могут быть ошибочны, а дизайн странным...\nТочно продолжить?'
            // );
            // store2.set(BETA_CONFIRM_KEY, confirm);
        }
    }, []);

    return (
        <>
            <MaterialContainer />
            {/* <FullcalendarContainer scheduleData={scheduleData} /> */}
        </>
    );
};

export default ScheduleView;
