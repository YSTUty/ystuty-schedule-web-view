import GroupScheduler from '../../../containers/MaterialScheduler/Group.scheduler';
import { useScheduleLoader } from './group.scheduleLoader';

const ScheduleView = () => {
    useScheduleLoader();

    return (
        <>
            <GroupScheduler />
        </>
    );
};

export default ScheduleView;
