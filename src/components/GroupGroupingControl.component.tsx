import { useDispatch, useSelector } from 'react-redux';
import { styled } from '@mui/material';

import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Collapse from '@mui/material/Collapse';

import scheduleSlice from '../store/reducer/schedule/schedule.slice';
import { ScheduleFor } from '../interfaces/ystuty.types';

const StyledToggleButtonGroup = styled(ToggleButtonGroup)(() => ({
    '@media (max-width: 600px)': {
        display: 'none',
    },
}));

type GroupGroupingControlProps = {
    scheduleFor: ScheduleFor;
};

const GroupGroupingControl: React.FC<GroupGroupingControlProps> = (props) => {
    const { scheduleFor } = props;

    const dispatch = useDispatch();
    const { groupsSplitColor, groupingGroups, isGroupByDate } = useSelector((state) => state.schedule);
    const selectedItems = useSelector((state) => state.schedule.selectedItems[scheduleFor]);

    const handleChange = (event: React.MouseEvent<HTMLElement>, val: string) => {
        switch (val) {
            case 'isGroupByDate':
                dispatch(scheduleSlice.actions.onGroupOrderToggle());
                break;
            case 'groupsSplitColor':
                dispatch(scheduleSlice.actions.groupsSplitColorToggle());
                break;
            case 'groupingGroups':
                dispatch(scheduleSlice.actions.groupingGroupsToggle());
                break;
            default:
                break;
        }
    };

    const show = selectedItems.length > 1;

    return (
        <Collapse sx={{ px: 1 }} in={show}>
            <StyledToggleButtonGroup exclusive onChange={handleChange}>
                <ToggleButton
                    value="groupingGroups"
                    selected={groupingGroups}
                    onChange={() => {
                        dispatch(scheduleSlice.actions.groupingGroupsToggle());
                    }}
                    title='Группировать по группам (Необходимо "Разделять группы по цвету" (GSC))'
                >
                    GG
                </ToggleButton>
                <ToggleButton
                    disabled={!groupingGroups}
                    value="isGroupByDate"
                    selected={isGroupByDate}
                    onChange={() => {
                        dispatch(scheduleSlice.actions.onGroupOrderToggle());
                    }}
                    title="Группировать по датам"
                >
                    GBD
                </ToggleButton>
                <ToggleButton
                    value="groupsSplitColor"
                    selected={groupsSplitColor}
                    onChange={() => {
                        dispatch(scheduleSlice.actions.groupsSplitColorToggle());
                    }}
                    title="Разделять группы по цвету"
                >
                    GSC
                </ToggleButton>
            </StyledToggleButtonGroup>
        </Collapse>
    );
};
export default GroupGroupingControl;
