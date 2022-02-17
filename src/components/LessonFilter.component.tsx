import { useDispatch, useSelector } from 'react-redux';

import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

import scheduleSlice from '../store/reducer/schedule/schedule.slice';

const PREFIX = 'LF';

const classes = {
    textField: `${PREFIX}-textField`,
};

const StyledTextField = styled(TextField)(({ theme: { spacing } }) => ({
    [`&.${classes.textField}`]: {
        width: '75px',
        marginLeft: spacing(1),
        marginTop: 0,
        marginBottom: 0,
        height: spacing(4.875),
    },
}));

const LessonFilter = () => {
    const { lessonFilter } = useSelector((state) => state.schedule);
    const dispatch = useDispatch();

    return (
        <StyledTextField
            size="small"
            placeholder="Filter"
            className={classes.textField}
            value={lessonFilter}
            onChange={({ target }) => dispatch(scheduleSlice.actions.updateLessonFilter(target.value))}
            variant="outlined"
            hiddenLabel
            margin="dense"
        />
    );
};
export default LessonFilter;
