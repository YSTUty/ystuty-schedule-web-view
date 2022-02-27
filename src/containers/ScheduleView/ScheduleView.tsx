import React from 'react';
import { useNetworkState } from 'react-use';
import store2 from 'store2';

import FullcalendarContainer from '../Fullcalendar/Fullcalendar';
import MaterialContainer from '../Material/Material';
// import SchedulerReact from '../SchedulerReact/SchedulerReact';

import { useSelectGroupComponent } from './selectGroup.util';
import { useScheduleLoader } from './scheduleLoader.util';

const BETA_CONFIRM_KEY = 'betaConfirm';

const ScheduleView = () => {
    const state = useNetworkState();
    const [scheduleData1, setScheduleData] = React.useState<any[]>([]);
    const [scheduleData2, setScheduleData2] = React.useState<any[]>([]);

    const [loadSchedule1, fetching1] = useScheduleLoader(setScheduleData);
    const [loadSchedule2, fetching2] = useScheduleLoader(setScheduleData2);
    const [Selector, groupNames] = useSelectGroupComponent(true);
    const fetchingSchedule = React.useMemo(() => fetching1 || fetching2, [fetching1, fetching2]);

    React.useEffect(() => {
        const [groupName1, groupName2] = groupNames;
        loadSchedule1(groupName1);

        if (groupName2) {
            loadSchedule2(groupName2);
        } else {
            setScheduleData2([]);
        }
    }, [groupNames]);

    const scheduleData = React.useMemo(() => {
        const [name1, name2] = groupNames;
        const data = [{ name: name1, data: scheduleData1 }];
        if (scheduleData2.length > 0 && name2) {
            data.push({ name: name2, data: scheduleData2 });
        }
        return data;
    }, [groupNames, scheduleData1, scheduleData2]);

    React.useEffect(() => {
        const isConfirmed = store2.get(BETA_CONFIRM_KEY, false);
        if (!isConfirmed) {
            const confirm = window.confirm(
                'Сайт находится в Альфа версии!\n\nДанные могут быть ошибочны, а дизайн странным...\nТочно продолжить?'
            );
            store2.set(BETA_CONFIRM_KEY, confirm);
        }
    }, []);

    return (
        <>
            {!state.online && <pre>{JSON.stringify(state, null, 2)}</pre>}
            <Selector fetchingSchedule={fetchingSchedule} />

            <hr />
            {!!1 ? (
                <MaterialContainer scheduleData={scheduleData} fetchingSchedule={fetchingSchedule} />
            ) : (
                // <SchedulerReact scheduleData={scheduleData} />
                <FullcalendarContainer scheduleData={scheduleData1} />
            )}
        </>
    );
};

export default ScheduleView;
