import React from 'react';
import { useSelector } from 'react-redux';
import classNames from 'clsx';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import LinearProgress from '@mui/material/LinearProgress';
import { red, green, teal, blue, yellow } from '@mui/material/colors';

import {
    Scheduler,
    WeekView,
    Appointments,
    AppointmentTooltip,
    AppointmentForm,
    DateNavigator,
    Toolbar,
    TodayButton,
    ViewSwitcher,
    MonthView,
    DayView,
    CurrentTimeIndicator,
    Resources,
} from '@devexpress/dx-react-scheduler-material-ui';
import { ViewState } from '@devexpress/dx-react-scheduler';

import RoomIcon from '@mui/icons-material/Room';
import TimeIcon from '@mui/icons-material/MoreTime';
import TeacherIcon from '@mui/icons-material/PermIdentity';
import LessonIcon from '@mui/icons-material/BookRounded';
import DivisionGroupsIcon from '@mui/icons-material/PeopleOutlined';
import StreamGroupsIcon from '@mui/icons-material/Groups';
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';
import InfoIcon from '@mui/icons-material/Info';

import LessonFilter from '../../components/LessonFilter.component';
import LessonTypeSelector from '../../components/LessonTypeSelector.component';

import { LessonFlags } from '../../interfaces/ystuty.types';

const PREFIX = 'MA';

const classes = {
    appointment: `${PREFIX}-appointment`,
    parityOtherAppointment: `${PREFIX}-parityOtherAppointment`,
    parityOddAppointment: `${PREFIX}-parityOddAppointment`,
    parityEvenAppointment: `${PREFIX}-parityEvenAppointment`,
    distantAppointment: `${PREFIX}-distantAppointment`,
    text: `${PREFIX}-text`,
    content: `${PREFIX}-content`,
    container: `${PREFIX}-container`,
    icon: `${PREFIX}-icon`,
    textCenter: `${PREFIX}-textCenter`,
    toolbarRoot: `${PREFIX}-toolbarRoot`,
    progress: `${PREFIX}-progress`,
    flexibleSpace: `${PREFIX}-flexibleSpace`,
};

const StyledDiv = styled('div')({
    [`&.${classes.toolbarRoot}`]: {
        position: 'relative',
    },
});

const StyledLinearProgress = styled(LinearProgress)(() => ({
    [`&.${classes.progress}`]: {
        position: 'absolute',
        width: '100%',
        bottom: 0,
        left: 0,
    },
}));

const StyledAppointmentsAppointment = styled(Appointments.Appointment)(() => ({
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
    [`&.${classes.distantAppointment}`]: {
        borderBottom: `2px dashed ${red[700]}`,
    },
}));

const StyledAppointmentsAppointmentContent = styled(Appointments.AppointmentContent)(({ theme: { palette } }) => ({
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

const StyledGrid = styled(Grid)(() => ({
    [`&.${classes.textCenter}`]: {
        textAlign: 'center',
    },
}));

const StyledIcon = styled('div')(({ theme: { palette } }) => ({
    [`&.${classes.icon}`]: {
        color: palette.action.active,
    },
}));

const StyledToolbarFlexibleSpace = styled(Toolbar.FlexibleSpace)(() => ({
    [`&.${classes.flexibleSpace}`]: {
        margin: '0 auto 0 0',
        display: 'flex',
        alignItems: 'center',
    },
}));

// ...

const ToolbarWithLoading = ({ children, ...restProps }: Toolbar.RootProps) => (
    <StyledDiv className={classes.toolbarRoot}>
        <Toolbar.Root {...restProps}>{children}</Toolbar.Root>
        <StyledLinearProgress className={classes.progress} />
    </StyledDiv>
);

const Appointment = ({ data, ...restProps }: Appointments.AppointmentProps) => (
    <StyledAppointmentsAppointment
        {...restProps}
        className={classNames({
            [classes.parityOtherAppointment]: data.parity === 0,
            [classes.parityOddAppointment]: data.parity === 1,
            [classes.parityEvenAppointment]: data.parity === 2,
            [classes.distantAppointment]: data.isDistant,
            [classes.appointment]: true,
        })}
        data={data}
    />
);

const getLessonTypeStrArr = (type: LessonFlags) => {
    const types: string[] = [];
    if (type & LessonFlags.Lecture) types.push('Лек');
    if (type & LessonFlags.Practical) types.push('ПР');
    if (type & LessonFlags.Labaratory) types.push('ЛР');
    if (type & LessonFlags.CourseProject) types.push('КП');
    if (type & LessonFlags.None) types.push('???');
    return types;
};

const AppointmentContent = ({ data, ...restProps }: Appointments.AppointmentContentProps) => {
    return (
        <StyledAppointmentsAppointmentContent {...restProps} data={data}>
            <div className={classes.container}>
                {/* Дисциплина */}
                <div className={classes.text}>
                    #{data.number}
                    {data.group && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: green['900'] }}> [{data.group}]</span>
                    )}{' '}
                    {data.title}
                </div>
                <div className={classes.text}>🕑 {data.time}</div>
                {data.type !== 0 && (
                    <div className={classNames(classes.text, classes.content)}>
                        • Вид занятий: {getLessonTypeStrArr(data.type).join(', ')}
                    </div>
                )}
                {data.auditoryName && (
                    <div className={classNames(classes.text, classes.content)}>• Аудитория: {data.auditoryName}</div>
                )}
                {data.teacherName && (
                    <div className={classNames(classes.text, classes.content)}>• Преподаватель: {data.teacherName}</div>
                )}
                {data.isDivision && <div className={classNames(classes.text, classes.content)}>• По П/Г</div>}
                {data.isStream && <div className={classNames(classes.text, classes.content)}>• В потоке</div>}
            </div>
        </StyledAppointmentsAppointmentContent>
    );
};

const AppointmentTooltipContent = ({ children, appointmentData, ...restProps }: AppointmentTooltip.ContentProps) => (
    <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
        {appointmentData!.isDistant && (
            <Grid container alignItems="center" color={red[800]}>
                <StyledGrid item xs={2} className={classes.textCenter}>
                    <OnlinePredictionIcon />
                </StyledGrid>
                <Grid item xs={10}>
                    Дистант
                </Grid>
            </Grid>
        )}
        {appointmentData!.auditoryName && (
            <Grid container alignItems="center">
                <StyledGrid item xs={2} className={classes.textCenter}>
                    <StyledIcon className={classes.icon}>
                        <RoomIcon />
                    </StyledIcon>
                </StyledGrid>
                <Grid item xs={10}>
                    <span>
                        <b>{appointmentData!.auditoryName}</b>
                    </span>
                </Grid>
            </Grid>
        )}
        {appointmentData!.duration > 2 && (
            <Grid container alignItems="center">
                <StyledGrid item xs={2} className={classes.textCenter}>
                    <StyledIcon className={classes.icon}>
                        <TimeIcon />
                    </StyledIcon>
                </StyledGrid>
                <Grid item xs={10}>
                    <span>
                        Продолжительность: <b>{appointmentData!.duration} ч</b>
                    </span>
                </Grid>
            </Grid>
        )}
        {appointmentData!.type !== 0 && (
            <Grid container alignItems="center">
                <StyledGrid item xs={2} className={classes.textCenter}>
                    <StyledIcon className={classes.icon}>
                        <LessonIcon />
                    </StyledIcon>
                </StyledGrid>
                <Grid item xs={10}>
                    Вид занятий: <b>{getLessonTypeStrArr(appointmentData!.type).join(', ')}</b>
                </Grid>
            </Grid>
        )}
        {appointmentData!.isStream && (
            <Grid container alignItems="center">
                <StyledGrid item xs={2} className={classes.textCenter}>
                    <StyledIcon className={classes.icon}>
                        <StreamGroupsIcon />
                    </StyledIcon>
                </StyledGrid>
                <Grid item xs={10}>
                    В потоке
                </Grid>
            </Grid>
        )}
        {appointmentData!.isDivision && (
            <Grid container alignItems="center">
                <StyledGrid item xs={2} className={classes.textCenter}>
                    <StyledIcon className={classes.icon}>
                        <DivisionGroupsIcon />
                    </StyledIcon>
                </StyledGrid>
                <Grid item xs={10}>
                    По П/Г
                </Grid>
            </Grid>
        )}
        {appointmentData!.teacherName && (
            <Grid container alignItems="center">
                <StyledGrid item xs={2} className={classes.textCenter}>
                    <StyledIcon className={classes.icon}>
                        <TeacherIcon />
                    </StyledIcon>
                </StyledGrid>
                <Grid item xs={10}>
                    <span>{appointmentData!.teacherName}</span>
                </Grid>
            </Grid>
        )}
        {appointmentData!.subInfo && (
            <Grid container alignItems="center">
                <StyledGrid item xs={2} className={classes.textCenter}>
                    <StyledIcon className={classes.icon}>
                        <InfoIcon />
                    </StyledIcon>
                </StyledGrid>
                <Grid item xs={10}>
                    <span>
                        <i>
                            <b>{appointmentData!.subInfo}</b>
                        </i>
                    </span>
                </Grid>
            </Grid>
        )}
        {!!1 && process.env.NODE_ENV === 'development' && (
            <Grid container alignItems="center">
                <StyledGrid item xs={2} className={classes.textCenter}>
                    <StyledIcon className={classes.icon}>
                        <InfoIcon />
                    </StyledIcon>
                </StyledGrid>
                <Grid item xs={10}>
                    <code>{JSON.stringify(appointmentData)}</code>
                </Grid>
            </Grid>
        )}
    </AppointmentTooltip.Content>
);

const FlexibleSpace = (props: Toolbar.FlexibleSpaceProps) => (
    <StyledToolbarFlexibleSpace {...props} className={classes.flexibleSpace}>
        <LessonFilter />
        <LessonTypeSelector />
    </StyledToolbarFlexibleSpace>
);

const resources = [
    {
        fieldName: 'typeArr',
        title: 'Type',
        instances: [
            { id: 1 << 1, text: 'Лекция', color: green },
            { id: 1 << 2, text: 'Практика', color: yellow },
            { id: 1 << 3, text: 'Лабораторна работа', color: blue },
            { id: 1 << 4, text: 'Курсовой проект', color: red },
            // etc...
        ],
        allowMultiple: true,
    },
];

const MaterialContainer = (props: { scheduleData: { name: string; data: any[] }[]; fetchingSchedule: Boolean }) => {
    const { scheduleData = [], fetchingSchedule } = props;
    const [data, setData] = React.useState<any[]>([]);
    const { lessonTypes, lessonFilter = '' } = useSelector((state) => state.schedule);

    React.useEffect(() => {
        const isComparing = scheduleData.length > 1;

        setData([
            ...scheduleData.flatMap((data) =>
                data.data.map((e) => ({
                    ...e,
                    startDate: new Date(e.start),
                    endDate: new Date(e.end),
                    ...(isComparing && { group: data.name }),
                }))
            ),
        ]);
    }, [setData, scheduleData]);

    const lowerCaseFilter = lessonFilter.toLowerCase();
    const dataMemo = React.useMemo(
        () =>
            data
                .filter((item) => lessonTypes.length < 1 || lessonTypes.some((type) => item.typeArr.includes(type)))
                .filter(
                    (dataItem) =>
                        dataItem.title?.toLowerCase()?.includes(lowerCaseFilter) ||
                        dataItem.auditoryName?.toLowerCase()?.includes(lowerCaseFilter) ||
                        dataItem.teacherName?.toLowerCase()?.includes(lowerCaseFilter)
                ),
        [data, lessonTypes, lowerCaseFilter]
    );

    return (
        <Paper style={{ height: '100vh' }}>
            <Scheduler locale="ru" data={dataMemo} firstDayOfWeek={1}>
                <ViewState />

                <MonthView />
                <WeekView startDayHour={6} endDayHour={23} excludedDays={[0]} />
                {/* <DayView displayName="Days" startDayHour={6} endDayHour={23} intervalCount={3} /> */}
                <DayView startDayHour={6} endDayHour={23} />

                <Appointments appointmentComponent={Appointment} appointmentContentComponent={AppointmentContent} />
                <AppointmentTooltip contentComponent={AppointmentTooltipContent} />
                <AppointmentForm readOnly />
                <Resources data={resources} />

                <CurrentTimeIndicator shadePreviousCells shadePreviousAppointments updateInterval={60e3} />
                <Toolbar
                    {...(fetchingSchedule ? { rootComponent: ToolbarWithLoading } : null)}
                    flexibleSpaceComponent={FlexibleSpace}
                />
                <DateNavigator />
                <ViewSwitcher />
                <TodayButton />
            </Scheduler>
        </Paper>
    );
};

export default MaterialContainer;
