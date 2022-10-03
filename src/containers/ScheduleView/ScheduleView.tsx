import MaterialContainer from '../Material/Material';
import { useScheduleLoader } from './scheduleLoader.util';

const ScheduleView = () => {
    useScheduleLoader();

    return (
        <>
            <MaterialContainer />
        </>
    );
};

export default ScheduleView;
