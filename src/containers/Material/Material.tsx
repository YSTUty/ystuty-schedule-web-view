import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'clsx';
import dayjs from 'dayjs';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
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
    GroupingPanel,
    AllDayPanel,
} from '@devexpress/dx-react-scheduler-material-ui';
import { GroupingState, IntegratedGrouping, ViewState } from '@devexpress/dx-react-scheduler';

import RoomIcon from '@mui/icons-material/Room';
import TimeIcon from '@mui/icons-material/MoreTime';
import TeacherIcon from '@mui/icons-material/PermIdentity';
import LessonIcon from '@mui/icons-material/BookRounded';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DivisionGroupsIcon from '@mui/icons-material/PeopleOutlined';
import StreamGroupsIcon from '@mui/icons-material/Groups';
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';
import InfoIcon from '@mui/icons-material/Info';

import LessonFilter from '../../components/LessonFilter.component';
import LessonTypeSelector from '../../components/LessonTypeSelector.component';
import GroupGroupingControl from '../../components/GroupGroupingControl.component';

import { LessonData, LessonFlags, WeekParityType } from '../../interfaces/ystuty.types';
import scheduleSlice from '../../store/reducer/schedule/schedule.slice';
import * as lessonsUtils from '../../utils/lessons.utils';

import {
    classes as dxClasses,
    DayScaleCell,
    getTimeTableCell,
    StyledAppointmentsAppointment,
    StyledAppointmentsAppointmentContent,
    StyledGrid,
    StyledIcon,
    StyledToolbarFlexibleSpace,
    ToolbarWithLoading,
} from './dx.components';

const Appointment = ({ data, ...restProps }: Appointments.AppointmentProps) => (
    <StyledAppointmentsAppointment
        {...restProps}
        className={classNames({
            [dxClasses.parityOtherAppointment]: data.parity === 0,
            [dxClasses.parityOddAppointment]: data.parity === 1,
            [dxClasses.parityEvenAppointment]: data.parity === 2,
            [dxClasses.distantAppointment]: data.isDistant,
            [dxClasses.streamAppointment]: data.isStream,
            [dxClasses.appointment]: true,
        })}
        data={data}
    />
);

const AppointmentContent = ({
    data,
    ...restProps
}: Appointments.AppointmentContentProps & {
    data: Appointments.AppointmentContentProps['data'] & LessonData & { group?: string };
}) => {
    let title = '';
    if (data.number) {
        title += `#${data.number}`;
    }
    if (data.group) {
        title += ` [${data.group}]`;
    }
    title += ` "${data.title}"\n`;
    if (data.time) {
        title += `🕑 Время: ${data.time}\n`;
    }
    if (data.type !== 0) {
        title += `• Вид занятий: ${lessonsUtils.getLessonTypeStrArr(data.type).join(', ')}\n`;
    }
    if (data.auditoryName) {
        title += `• Аудитория: ${data.auditoryName}\n`;
    }
    if (data.teacherName) {
        title += `• Преподаватель: ${data.teacherName}\n`;
    }
    if (data.isDivision) {
        title += `• По П/Г\n`;
    }
    if (data.isStream) {
        title += `• В потоке`;
    }

    return (
        <StyledAppointmentsAppointmentContent {...restProps} data={data} title={title}>
            <div className={dxClasses.container}>
                {/* Дисциплина */}
                <div className={dxClasses.text}>
                    {data.number && <>#{data.number}</>}
                    {data.group && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: green['900'] }}> [{data.group}]</span>
                    )}{' '}
                    {data.title}
                </div>
                {data.time && <div className={dxClasses.text}>🕑 {data.time}</div>}
                {data.type !== 0 && (
                    <div className={classNames(dxClasses.text, dxClasses.content)}>
                        • Вид занятий: {lessonsUtils.getLessonTypeStrArr(data.type).join(', ')}
                    </div>
                )}
                {data.auditoryName && (
                    <div className={classNames(dxClasses.text, dxClasses.content)}>
                        • Аудитория: {data.auditoryName}
                    </div>
                )}
                {data.teacherName && (
                    <div className={classNames(dxClasses.text, dxClasses.content)}>
                        • Преподаватель: {data.teacherName}
                    </div>
                )}
                {data.isDivision && <div className={classNames(dxClasses.text, dxClasses.content)}>• По П/Г</div>}
                {data.isStream && <div className={classNames(dxClasses.text, dxClasses.content)}>• В потоке</div>}
            </div>
        </StyledAppointmentsAppointmentContent>
    );
};

const AppointmentTooltipContent = ({
    children,
    appointmentData,
    ...restProps
}: AppointmentTooltip.ContentProps & {
    appointmentData: AppointmentTooltip.ContentProps['appointmentData'] & LessonData & { group?: string };
}) => (
    <AppointmentTooltip.Content {...restProps} appointmentData={appointmentData}>
        {appointmentData.isDistant && (
            <Grid container alignItems="center" color={red[800]}>
                <StyledGrid item xs={2} className={dxClasses.textCenter}>
                    <OnlinePredictionIcon />
                </StyledGrid>
                <Grid item xs={10}>
                    Дистант
                </Grid>
            </Grid>
        )}
        {appointmentData.auditoryName && (
            <Grid container alignItems="center">
                <StyledGrid item xs={2} className={dxClasses.textCenter}>
                    <StyledIcon className={dxClasses.icon}>
                        <RoomIcon />
                    </StyledIcon>
                </StyledGrid>
                <Grid item xs={10}>
                    <span>
                        <b>{appointmentData.auditoryName}</b>
                    </span>
                </Grid>
            </Grid>
        )}
        {appointmentData.duration > 2 && (
            <Grid container alignItems="center">
                <StyledGrid item xs={2} className={dxClasses.textCenter}>
                    <StyledIcon className={dxClasses.icon}>
                        <TimeIcon />
                    </StyledIcon>
                </StyledGrid>
                <Grid item xs={10}>
                    <span>
                        Продолжительность: <b>{appointmentData.duration} ч</b>
                    </span>
                </Grid>
            </Grid>
        )}
        {appointmentData.type !== 0 && (
            <Grid container alignItems="center">
                <StyledGrid item xs={2} className={dxClasses.textCenter}>
                    <StyledIcon className={dxClasses.icon}>
                        <LessonIcon />
                    </StyledIcon>
                </StyledGrid>
                <Grid item xs={10}>
                    Вид занятий: <b>{lessonsUtils.getLessonTypeStrArr(appointmentData.type).join(', ')}</b>
                </Grid>
            </Grid>
        )}
        {appointmentData.isStream && (
            <Grid container alignItems="center">
                <StyledGrid item xs={2} className={dxClasses.textCenter}>
                    <StyledIcon className={dxClasses.icon}>
                        <StreamGroupsIcon />
                    </StyledIcon>
                </StyledGrid>
                <Grid item xs={10}>
                    В потоке
                </Grid>
            </Grid>
        )}
        {appointmentData.isDivision && (
            <Grid container alignItems="center">
                <StyledGrid item xs={2} className={dxClasses.textCenter}>
                    <StyledIcon className={dxClasses.icon}>
                        <DivisionGroupsIcon />
                    </StyledIcon>
                </StyledGrid>
                <Grid item xs={10}>
                    По П/Г
                </Grid>
            </Grid>
        )}
        {appointmentData.teacherName && (
            <Grid container alignItems="center">
                <StyledGrid item xs={2} className={dxClasses.textCenter}>
                    <StyledIcon className={dxClasses.icon}>
                        <TeacherIcon />
                    </StyledIcon>
                </StyledGrid>
                <Grid item xs={10}>
                    <span>{appointmentData.teacherName}</span>
                </Grid>
            </Grid>
        )}
        {appointmentData.subInfo && (
            <Grid container alignItems="center">
                <StyledGrid item xs={2} className={dxClasses.textCenter}>
                    <StyledIcon className={dxClasses.icon}>
                        <InfoIcon />
                    </StyledIcon>
                </StyledGrid>
                <Grid item xs={10}>
                    <span>
                        <i>
                            <b>{appointmentData.subInfo}</b>
                        </i>
                    </span>
                </Grid>
            </Grid>
        )}
        {appointmentData.parity !== WeekParityType.CUSTOM && (
            <Grid container alignItems="center">
                <StyledGrid item xs={2} className={dxClasses.textCenter}>
                    <StyledIcon className={dxClasses.icon}>
                        <CalendarTodayIcon />
                    </StyledIcon>
                </StyledGrid>
                <Grid item xs={10}>
                    Только на <b>{appointmentData.parity === WeekParityType.EVEN ? '' : 'не'}четной</b> неделе
                </Grid>
            </Grid>
        )}
        {!!1 && process.env.NODE_ENV === 'development' && (
            <Grid container alignItems="center">
                <StyledGrid item xs={2} className={dxClasses.textCenter}>
                    <StyledIcon className={dxClasses.icon}>
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

const TitleCellComponent = () => <AllDayPanel.TitleCell getMessage={(e) => (e === 'allDay' ? 'Весь день' : e)} />;

const FlexibleSpace = ({ ...props }: Toolbar.FlexibleSpaceProps) => (
    <StyledToolbarFlexibleSpace {...props} className={dxClasses.flexibleSpace}>
        <LessonFilter />
        <LessonTypeSelector />
        <GroupGroupingControl />
    </StyledToolbarFlexibleSpace>
);

const getResources = (selectedGroups: string[] = []) => [
    {
        fieldName: 'group',
        title: 'Группа',
        instances: selectedGroups.map((e, i) => ({ id: e, text: e, color: [green, blue, yellow, teal, red][i] })),
    },
    {
        fieldName: 'typeArr',
        title: 'Type',
        instances: [
            { id: LessonFlags.Lecture, text: 'Лекция', color: green },
            { id: LessonFlags.Practical, text: 'Практика', color: yellow },
            { id: LessonFlags.Labaratory, text: 'Лабораторна работа', color: blue },
            { id: LessonFlags.CourseProject, text: 'Курсовой проект', color: red },
            { id: LessonFlags.Consultation, text: 'Консультация', color: green },
            { id: LessonFlags.Test, text: 'Зачет', color: teal },
            { id: LessonFlags.DifferentiatedTest, text: 'Диф. зачет', color: red },
            { id: LessonFlags.Exam, text: 'Экзамен', color: red },
            { id: LessonFlags.Library, text: 'Библиотека', color: teal },
            { id: LessonFlags.ResearchWork, text: 'Научно-исследовательская работа', color: yellow },
            // etc...
        ],
        allowMultiple: true,
    },
];

const MaterialContainer = () => {
    const dispatch = useDispatch();
    const {
        lessonTypes,
        lessonFilter = '',
        selectedGroups,
        groupsSplitColor,
        groupingGroups,
        isGroupByDate,
        fetchingSchedule,
        studScheduleData: scheduleData,
    } = useSelector((state) => state.schedule);
    const [data, setData] = React.useState<
        (LessonData & { startDate: Date; endDate: Date; group?: string; allDay?: boolean })[]
    >([]);

    React.useEffect(() => {
        const isComparing = scheduleData.length > 1;
        const allowedLessonTypes: Record<LessonFlags, any> = {};
        const data = [
            ...scheduleData.flatMap((data) =>
                data.data.map((e) => {
                    for (const type of e.typeArr) {
                        allowedLessonTypes[type] = true;
                    }
                    const startDate = dayjs(e.start);
                    const endDate = dayjs(e.end);
                    const durationDays = endDate.diff(startDate, 'days');
                    return {
                        ...e,
                        startDate: startDate.toDate(),
                        endDate: endDate.toDate(),
                        ...(durationDays > 0 && { allDay: true }),
                        ...(isComparing && { group: data.name }),
                    };
                }),
            ),
        ];

        dispatch(
            scheduleSlice.actions.setAllowedLessonTypes(
                Object.keys(allowedLessonTypes).map((e) => Number(e)) as LessonFlags[],
            ),
        );
        setData(data);
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
                        dataItem.teacherName?.toLowerCase()?.includes(lowerCaseFilter),
                ),
        [data, lessonTypes, lowerCaseFilter],
    );

    const mainResourceName = selectedGroups.length > 1 && groupsSplitColor ? 'group' : 'typeArr';
    const hasGroupingGroups = selectedGroups.length > 1 && groupingGroups;

    return (
        <Paper style={{ height: 'calc(100vh - 56px)' }}>
            <Scheduler locale="ru" data={dataMemo} firstDayOfWeek={1}>
                <ViewState />
                {hasGroupingGroups && (
                    <GroupingState
                        grouping={[{ resourceName: mainResourceName }]}
                        groupByDate={
                            !isGroupByDate ? undefined : (viewName) => viewName === 'Week' || viewName === 'Month'
                        }
                    />
                )}

                <MonthView
                    dayScaleCellComponent={DayScaleCell}
                    timeTableCellComponent={getTimeTableCell(hasGroupingGroups)}
                />
                <WeekView startDayHour={6} endDayHour={23} excludedDays={[0]} />
                {/* <DayView displayName="Days" startDayHour={6} endDayHour={23} intervalCount={3} /> */}
                <DayView startDayHour={6} endDayHour={23} />
                <AllDayPanel titleCellComponent={TitleCellComponent} />

                <Appointments
                    appointmentComponent={Appointment}
                    appointmentContentComponent={AppointmentContent as any}
                />
                <AppointmentTooltip contentComponent={AppointmentTooltipContent as any} />
                <AppointmentForm readOnly />
                <Resources data={getResources(selectedGroups)} mainResourceName={mainResourceName} />

                <CurrentTimeIndicator shadePreviousCells shadePreviousAppointments updateInterval={60e3} />
                <Toolbar
                    {...(fetchingSchedule ? { rootComponent: ToolbarWithLoading } : null)}
                    flexibleSpaceComponent={FlexibleSpace}
                />
                <DateNavigator />
                <ViewSwitcher />
                <TodayButton messages={{ today: 'Сегодня' }} />

                {hasGroupingGroups && <IntegratedGrouping />}
                {hasGroupingGroups && <GroupingPanel />}
            </Scheduler>
        </Paper>
    );
};

export default MaterialContainer;
