import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

import { useDispatch, useSelector } from '@/store';
import scheduleSlice from '@/store/reducer/schedule/schedule.slice';

const PREFIX = 'LF';

const classes = {
  textField: `${PREFIX}-textField`,
};

const StyledTextField = styled(TextField)(({ theme: { spacing } }) => ({
  [`&.${classes.textField}`]: {
    flex: '0 1 240px',
    minWidth: '90px',
    marginTop: 0,
    marginBottom: 0,
    height: spacing(4.875),

    '@media (max-width: 1439.95px)': {
      flexBasis: '90px',
    },

    '@media (max-width: 1023.95px)': {
      flex: '1 1 160px',
    },

    '@media (max-width: 599.95px)': {
      flex: '1 1 0',
      minWidth: 0,
    },
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
      onChange={({ target }) =>
        dispatch(scheduleSlice.actions.updateLessonFilter(target.value))
      }
      variant="outlined"
      hiddenLabel
      margin="dense"
    />
  );
};
export default LessonFilter;
