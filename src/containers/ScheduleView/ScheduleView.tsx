import React from 'react';
import { useNetworkState } from 'react-use';
import store2 from 'store2';

import FullcalendarContainer from '../Fullcalendar/Fullcalendar';
import MaterialContainer from '../Material/Material';
// import SchedulerReact from '../SchedulerReact/SchedulerReact';

import { SelectGroupComponent } from '../../components/SelectGroup.component';
import { useScheduleLoader } from './scheduleLoader.util';

const BETA_CONFIRM_KEY = 'betaConfirm';

const ScheduleView = () => {
    const state = useNetworkState();

    const [scheduleData, fetchingSchedule] = useScheduleLoader();

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
            {process.env.NODE_ENV === 'development' && !state.online && <pre>{JSON.stringify(state, null, 2)}</pre>}
            <SelectGroupComponent fetchingSchedule={fetchingSchedule} />

            <hr />
            {!!1 ? (
                <MaterialContainer scheduleData={scheduleData} fetchingSchedule={fetchingSchedule} />
            ) : (
                // <SchedulerReact scheduleData={scheduleData} />
                <FullcalendarContainer scheduleData={scheduleData} />
            )}
        </>
    );
};

export default ScheduleView;
