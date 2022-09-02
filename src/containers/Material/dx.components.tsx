import React from 'react';
import classNames from 'clsx';
import { alpha, styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import { red, yellow } from '@mui/material/colors';

import { Appointments, Toolbar, MonthView } from '@devexpress/dx-react-scheduler-material-ui';

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

export const StyledAppointmentsAppointment = styled(Appointments.Appointment)(() => ({
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
}));

export const StyledAppointmentsAppointmentContent = styled(Appointments.AppointmentContent)(
    ({ theme: { palette } }) => ({
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
    })
);

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

export const StyledToolbarFlexibleSpace = styled(Toolbar.FlexibleSpace)(() => ({
    [`&.${classes.flexibleSpace}`]: {
        margin: '0 auto 0 0',
        display: 'flex',
        alignItems: 'center',
    },
}));

const StyledMonthViewDayScaleCell = styled(MonthView.DayScaleCell)(({ theme: { palette } }) => ({
    [`&.${classes.weekEndDayScaleCell}`]: {
        backgroundColor: alpha(palette.action.disabledBackground, 0.06),
    },
}));

const StyledMonthViewTimeTableCell = styled(MonthView.TimeTableCell)(({ theme: { palette } }) => ({
    [`&.${classes.weekCellFullSize}1`]: {
        minHeight: '100px',
        height: 'calc((100vh / 6) - ((56px + 28px) / 6) - 2px)',
    },
    [`&.${classes.weekCellFullSize}2`]: {
        minHeight: '100px',
        height: 'calc((100vh / 6) - ((56px + 28px + 75px) / 6) - 2px)',
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
}));

export const ToolbarWithLoading = ({ children, ...restProps }: Toolbar.RootProps) => (
    <StyledDiv className={classes.toolbarRoot}>
        <Toolbar.Root {...restProps}>{children}</Toolbar.Root>
        <StyledLinearProgress className={classes.progress} />
    </StyledDiv>
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

export const getTimeTableCell = (groupingGroups: boolean) => (props: MonthView.TimeTableCellProps) =>
    (
        <StyledMonthViewTimeTableCell
            className={classNames({
                [classes.weekCellFullSize + (!groupingGroups ? 1 : 2)]: true,
                [classes.weekEndCell]: isWeekEnd(props.startDate!),
            })}
            {...props}
        />
    );
