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
import GroupsIcon from '@mui/icons-material/Groups2';
import LessonIcon from '@mui/icons-material/BookRounded';
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';
import InfoIcon from '@mui/icons-material/Info';

import LessonFilter from '../../components/LessonFilter.component';
import LessonTypeSelector from '../../components/LessonTypeSelector.component';
import GroupGroupingControl from '../../components/GroupGroupingControl.component';
import { getTeachers } from '../../components/SelectTeacher.component';

import scheduleSlice from '../../store/reducer/schedule/schedule.slice';
import * as lessonsUtils from '../../utils/lessons.utils';

import { LessonFlags, LessonData } from '../../interfaces/schedule';

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
            [dxClasses.appointment]: true,
        })}
        data={data}
    />
);

const AppointmentContent = ({
    data,
    ...restProps
}: Appointments.AppointmentContentProps & {
    data: Appointments.AppointmentContentProps['data'] & LessonData & { teacherId?: number };
}) => {
    let title = '';
    if (data.number) {
        title += `#${data.number}`;
    }
    if (data.teacherId) {
        title += ` [${teachers?.find((e) => e.id === data.teacherId)?.name || data.teacherId}]`;
    }
    title += ` "${data.title}"\n`;
    if (data.timeRange) {
        title += `🕑 Время: ${data.timeRange}\n`;
    }
    if (data.type !== 0) {
        title += `• Вид занятий: ${lessonsUtils.getLessonTypeStrArr(data.type).join(', ')}\n`;
    }
    if (data.auditoryName) {
        title += `• Аудитория: ${data.auditoryName}\n`;
    }
    if (data.groups) {
        title += `• Группы: ${data.groups.join(', ')}`;
    }

    return (
        <StyledAppointmentsAppointmentContent {...restProps} data={data} title={title}>
            <div className={dxClasses.container}>
                {/* Дисциплина */}
                <div className={dxClasses.text}>
                    {data.number && <>#{data.number}</>}
                    {data.teacherId && (
                        <span style={{ fontSize: 10, fontWeight: 700, color: green['900'] }}>
                            {' ['}
                            {((e?: string) =>
                                e
                                    ?.split(' ')
                                    .map((e, i) => /* i === 0 ? e.slice(0, 5) : */ e[0])
                                    .join('.')
                                    .trim())(teachers?.find((e) => e.id === data.teacherId)?.name) || data.teacherId}
                            {']'}
                        </span>
                    )}{' '}
                    {data.title}
                </div>
                {data.timeRange && <div className={dxClasses.text}>🕑 {data.timeRange}</div>}
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
                {data.groups && (
                    <div className={classNames(dxClasses.text, dxClasses.content)}>
                        • Группы: {data.groups.join(', ')}
                    </div>
                )}
            </div>
        </StyledAppointmentsAppointmentContent>
    );
};

const AppointmentTooltipContent = ({
    children,
    appointmentData,
    ...restProps
}: AppointmentTooltip.ContentProps & {
    appointmentData: AppointmentTooltip.ContentProps['appointmentData'] & LessonData & { teacherId?: number };
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
        {appointmentData.groups!.length > 0 && (
            <Grid container alignItems="center">
                <StyledGrid item xs={2} className={dxClasses.textCenter}>
                    <StyledIcon className={dxClasses.icon}>
                        <GroupsIcon />
                    </StyledIcon>
                </StyledGrid>
                <Grid item xs={10}>
                    <span>{appointmentData.groups!.join(', ')}</span>
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

const teachers = getTeachers();
const getResources = (selectedTeachers: number[] = []) => [
    {
        fieldName: 'teacherId',
        title: 'Преподаватель',
        instances: selectedTeachers.map((id, i) => ({
            id,
            text:
                ((e?: string) =>
                    e
                        ?.split(' ')
                        .map((e, i) => /* i === 0 ? e.slice(0, 5) : */ e[0])
                        .join('.')
                        .trim())(teachers?.find((e) => e.id === id)?.name) || `#${id}`,
            color: [green, blue, yellow, teal, red][i],
        })),
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

const MaterialTeacherContainer = () => {
    const dispatch = useDispatch();
    const {
        lessonTypes,
        lessonFilter = '',
        selectedTeachers,
        groupsSplitColor,
        groupingGroups,
        isGroupByDate,
        fetchingSchedule,
        teacherScheduleData: scheduleData,
    } = useSelector((state) => state.schedule);
    const [data, setData] = React.useState<
        (LessonData & { startDate: Date; endDate: Date; teacherId?: number; allDay?: boolean })[]
    >([]);

    React.useEffect(() => {
        const isComparing = scheduleData.length > 1;
        const allowedLessonTypes: Partial<Record<LessonFlags, any>> = {};
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
                        ...(isComparing && { teacherId: data.teacherId }),
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
                        dataItem.groups?.join(', ')?.toLowerCase()?.includes(lowerCaseFilter),
                ),
        [data, lessonTypes, lowerCaseFilter],
    );

    const mainResourceName = selectedTeachers.length > 1 && groupsSplitColor ? 'teacherId' : 'typeArr';
    const hasGroupingGroups = selectedTeachers.length > 1 && groupingGroups;

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
                <Resources data={getResources(selectedTeachers)} mainResourceName={mainResourceName} />

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

export default MaterialTeacherContainer;
