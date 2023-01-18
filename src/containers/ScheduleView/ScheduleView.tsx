import MaterialContainer from '../Material/Material';
import NewMaterialContainer from '../Material/NewMaterial.container';
import { useScheduleLoader } from './scheduleLoader.util';

const ScheduleView = () => {
    useScheduleLoader();

    return (
        <>
            {/* <MaterialContainer /> */}
            <NewMaterialContainer />
        </>
    );
};

export default ScheduleView;
