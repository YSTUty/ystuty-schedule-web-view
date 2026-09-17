import classNames from 'clsx';

import {
  Appointments,
  DateNavigator,
  MonthView,
  TodayButton,
  Toolbar,
  ViewSwitcher,
} from '@devexpress/dx-react-scheduler-material-ui';

import { red, yellow } from '@mui/material/colors';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import { alpha, styled } from '@mui/material/styles';

const PREFIX = 'MA';

export const classes = {
  appointment: `${PREFIX}-appointment`,
  parityOtherAppointment: `${PREFIX}-parityOtherAppointment`,
  parityOddAppointment: `${PREFIX}-parityOddAppointment`,
  parityEvenAppointment: `${PREFIX}-parityEvenAppointment`,
  distantAppointment: `${PREFIX}-distantAppointment`,
  streamAppointment: `${PREFIX}-streamAppointment`,
  text: `${PREFIX}-text`,
  content: `${PREFIX}-content`,
  container: `${PREFIX}-container`,
  icon: `${PREFIX}-icon`,
  textCenter: `${PREFIX}-textCenter`,
  toolbarRoot: `${PREFIX}-toolbarRoot`,
  todayButton: `${PREFIX}-todayButton`,
  dateNavigator: `${PREFIX}-dateNavigator`,
  viewSwitcher: `${PREFIX}-viewSwitcher`,
  progress: `${PREFIX}-progress`,
  flexibleSpace: `${PREFIX}-flexibleSpace`,
  weekCellFullSize: `${PREFIX}-weekCellFullSize`,
  weekEndCell: `${PREFIX}-weekEndCell`,
  weekEndDayScaleCell: `${PREFIX}-weekEndDayScaleCell`,
};

const StyledLinearProgress = styled(LinearProgress)(() => ({
  [`&.${classes.progress}`]: {
    position: 'absolute',
    width: '100%',
    bottom: 0,
    left: 0,
  },
}));

const StyledDiv = styled('div')({
  [`&.${classes.toolbarRoot}`]: {
    position: 'relative',
  },
});

export const StyledAppointmentsAppointment = styled(Appointments.Appointment)(
  () => ({
    [`&.${classes.appointment}`]: {
      borderRadius: '3px',
      borderBottom: 0,
    },
    [`&.${classes.parityOtherAppointment}`]: {
      // borderLeft: `4px solid ${teal[500]}`,
    },
    [`&.${classes.parityOddAppointment}`]: {
      borderLeft: `4px solid ${yellow[500]}`,
    },
    [`&.${classes.parityEvenAppointment}`]: {
      borderLeft: `4px solid ${red[400]}`,
    },
    [`&.${classes.streamAppointment}`]: {
      borderRight: `2px dashed ${yellow[700]}`,
    },
    [`&.${classes.distantAppointment}`]: {
      borderBottom: `2px dashed ${red[700]}`,
    },
  }),
);

export const StyledAppointmentsAppointmentContent = styled(
  Appointments.AppointmentContent,
)(() => ({
  [`& .${classes.text}`]: {
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
    color: 'black',
  },
  [`& .${classes.content}`]: {
    opacity: 0.8,
  },
  [`& .${classes.container}`]: {
    width: '100%',
    height: '100%',
    lineHeight: 1.1,
  },
}));

export const StyledGrid = styled(Grid)(() => ({
  [`&.${classes.textCenter}`]: {
    textAlign: 'center',
  },
}));

export const StyledIcon = styled('div')(({ theme: { palette } }) => ({
  [`&.${classes.icon}`]: {
    color: palette.action.active,
  },
}));

export const ResponsiveToolbarRoot = styled(Toolbar.Root)(({ theme }) => ({
  alignItems: 'center',
  columnGap: theme.spacing(1),
  display: 'grid',
  gridTemplateAreas: '"today navigator filters view"',
  gridTemplateColumns: 'auto auto minmax(0, 1fr) auto',
  minHeight: theme.spacing(7),
  paddingBottom: theme.spacing(0.5),
  paddingTop: theme.spacing(0.5),
  rowGap: theme.spacing(0.75),

  [`& > .${classes.todayButton}`]: {
    gridArea: 'today',
  },
  [`& > .${classes.dateNavigator}`]: {
    gridArea: 'navigator',
  },
  [`& > .${classes.viewSwitcher}`]: {
    gridArea: 'view',
  },
  [`& > .${classes.flexibleSpace}`]: {
    gridArea: 'filters',
  },

  '@media (max-width: 1023.95px)': {
    gridTemplateAreas: `
      "today navigator view"
      "filters filters filters"
    `,
    gridTemplateColumns: 'auto minmax(0, 1fr) auto',
    paddingBottom: theme.spacing(0.75),
    paddingTop: theme.spacing(0.75),
  },

  '@media (max-width: 599.95px)': {
    columnGap: theme.spacing(0.5),
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(1),
  },
}));

const StyledResponsiveDateNavigatorRoot = styled(DateNavigator.Root)(
  ({ theme }) => ({
    alignItems: 'center',
    display: 'inline-flex',
    flexShrink: 0,
    marginLeft: 0,
    whiteSpace: 'nowrap',

    '@media (max-width: 599.95px)': {
      '& .MuiIconButton-root': {
        height: theme.spacing(4),
        padding: 0,
        width: theme.spacing(4),
      },
    },
  }),
);

const StyledResponsiveViewSwitcher = styled(ViewSwitcher.Switcher)(() => ({
  flexShrink: 0,
}));

export const ResponsiveDateNavigatorRoot = (
  props: DateNavigator.RootProps & { className?: string },
) => (
  <StyledResponsiveDateNavigatorRoot
    {...props}
    className={classNames(props.className, classes.dateNavigator)}
  />
);

export const ResponsiveViewSwitcher = (
  props: ViewSwitcher.SwitcherProps & { className?: string },
) => (
  <StyledResponsiveViewSwitcher
    {...props}
    className={classNames(props.className, classes.viewSwitcher)}
  />
);

export const ResponsiveTodayButton = (
  props: TodayButton.ButtonProps & { className?: string },
) => (
  <TodayButton.Button
    {...props}
    className={classNames(props.className, classes.todayButton)}
  />
);

export const StyledToolbarFlexibleSpace = styled(Toolbar.FlexibleSpace)(
  ({ theme }) => ({
    [`&.${classes.flexibleSpace}`]: {
      alignItems: 'center',
      display: 'flex',
      flex: '1 1 auto',
      gap: theme.spacing(1),
      margin: 0,
      minWidth: 0,
      width: 'auto',
    },

    '@media (max-width: 1023.95px)': {
      flexBasis: '100%',
      paddingBottom: theme.spacing(0.75),
      width: '100%',
    },

    '@media (max-width: 599.95px)': {
      gap: theme.spacing(0.75),
    },
  }),
);

export const ToolbarWithLoading = ({
  children,
  ...restProps
}: Toolbar.RootProps) => (
  <StyledDiv className={classes.toolbarRoot}>
    <ResponsiveToolbarRoot {...restProps}>{children}</ResponsiveToolbarRoot>
    <StyledLinearProgress className={classes.progress} />
  </StyledDiv>
);

const StyledMonthViewDayScaleCell = styled(MonthView.DayScaleCell)(
  ({ theme: { palette } }) => ({
    [`&.${classes.weekEndDayScaleCell}`]: {
      backgroundColor: alpha(palette.action.disabledBackground, 0.06),
    },
  }),
);

const StyledMonthViewTimeTableCell = styled(MonthView.TimeTableCell)(
  ({ theme: { palette } }) => ({
    [`&.${classes.weekCellFullSize}1`]: {
      minHeight: '100px',
      height: 'calc((100vh / 6) - ((56px + 56px + 28px) / 6) - 2px)',
    },
    [`&.${classes.weekCellFullSize}2`]: {
      minHeight: '100px',
      height: 'calc((100vh / 6) - ((56px + 56px + 28px + 75px) / 6) - 2px)',
    },
    [`&.${classes.weekEndCell}`]: {
      backgroundColor: alpha(palette.action.disabledBackground, 0.04),
      '&:hover': {
        backgroundColor: alpha(palette.action.disabledBackground, 0.04),
      },
      '&:focus': {
        backgroundColor: alpha(palette.action.disabledBackground, 0.04),
      },
    },
  }),
);

const isWeekEnd = (date: Date) => date.getDay() === 0;

export const DayScaleCell = (props: MonthView.DayScaleCellProps) => (
  <StyledMonthViewDayScaleCell
    className={classNames({
      [classes.weekEndDayScaleCell]: isWeekEnd(props.startDate),
    })}
    {...props}
  />
);

export const getTimeTableCell =
  (groupingGroups: boolean) => (props: MonthView.TimeTableCellProps) => (
    <StyledMonthViewTimeTableCell
      className={classNames({
        [classes.weekCellFullSize + (!groupingGroups ? 1 : 2)]: true,
        [classes.weekEndCell]: isWeekEnd(props.startDate!),
      })}
      {...props}
    />
  );
