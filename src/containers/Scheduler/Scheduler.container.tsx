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
import {
    GroupingState,
    IntegratedGrouping,
    Resource,
    SchedulerDateTime,
    ViewState,
} from '@devexpress/dx-react-scheduler';

import RoomIcon from '@mui/icons-material/Room';
import TimeIcon from '@mui/icons-material/MoreTime';
import TeacherIcon from '@mui/icons-material/PermIdentity';
import StreamGroupsIcon from '@mui/icons-material/Groups';
import GroupsIcon from '@mui/icons-material/Groups2';
import LessonIcon from '@mui/icons-material/BookRounded';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DivisionGroupsIcon from '@mui/icons-material/PeopleOutlined';
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';
import InfoIcon from '@mui/icons-material/Info';

import LessonFilter from '../../components/LessonFilter.component';
import LessonTypeSelector from '../../components/LessonTypeSelector.component';
import GroupGroupingControl from '../../components/GroupGroupingControl.component';
import { getTeachers } from '../../components/SelectTeacher.component';

import scheduleSlice from '../../store/reducer/schedule/schedule.slice';
import * as lessonsUtils from '../../utils/lessons.utils';

import { LessonData, LessonFlags, WeekParityType } from '../../interfaces/schedule';
import { ScheduleFor } from '../../interfaces/ystuty.types';

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

export interface AppointmentModel extends LessonData {
    /** The start date. */
    startDate: SchedulerDateTime;
    /** The end date. */
    endDate?: SchedulerDateTime;
    /** The all day flag. */
    allDay?: boolean;
    /** The identifier. */
    id?: number | string;
    /** Specifies the appointment recurrence rule. */
    rRule?: string | undefined;
    /** Specifies dates excluded from recurrence. */
    exDate?: string | undefined;

    // /** Any other properties. */
    // [propertyName: string]: any;

    group?: string;
    audienceName_?: string;
    scheduleFor: ScheduleFor;
}

type AppointmentProps = Appointments.AppointmentProps & {
    data: AppointmentModel;
};

type AppointmentContentProps = Appointments.AppointmentContentProps & {
    data: AppointmentModel;
};

type AppointmentTooltipContentProps = AppointmentTooltip.ContentProps & {
    appointmentData: AppointmentModel;
};

const Appointment = ({ data, ...restProps }: AppointmentProps) => (
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

const AppointmentContent = ({ data, ...restProps }: AppointmentContentProps) => {
    let title = '';
    if (data.number) {
        title += `#${data.number}`;
    }

    if (data.group && data.scheduleFor === 'group') {
        title += ` [${data.group}]`;
    } else if (data.teacherId && data.scheduleFor === 'teacher') {
        title += ` [${
            data.teacherName || /* teachers?.find((e) => e.id === data.teacherId)?.name || */ data.teacherId
        }`;
        if (data.additionalTeacherName) {
            title += `/${data.additionalTeacherName}`;
        }
        title += ']';
    } else if (data.audienceName_ && data.scheduleFor === 'audience') {
        title += ` [`;
        title += `${data.audienceName_}`;
        if (data.additionalAuditoryName) {
            title += `/${data.additionalAuditoryName}`;
        }
        title += ']';
    }

    title += ` "${data.title}"\n`;
    if (data.timeRange) {
        title += `🕑 Время: ${data.timeRange}\n`;
    }
    if (data.type !== 0) {
        title += `• Вид занятий: ${lessonsUtils.getLessonTypeStrArr(data.type).join(', ')}\n`;
    }
    if (data.auditoryName) {
        title += `• Аудитория: ${data.auditoryName}${
            data.additionalAuditoryName ? `/${data.additionalAuditoryName}` : ''
        }\n`;
    }

    if (data.groups && data.groups.length > 0) {
        title += `• Группы: ${data.groups.join(', ')}\n`;
    }
    if (data.teacherName || data.additionalTeacherName) {
        title += `• Преподаватель: ${data.teacherName}${
            data.additionalTeacherName ? `/${data.additionalTeacherName}` : ''
        }\n`;
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
                    {data.scheduleFor === 'group'
                        ? data.group && (
                              <span style={{ fontSize: 10, fontWeight: 700, color: green['900'] }}>
                                  {' '}
                                  [{data.group}]
                              </span>
                          )
                        : data.scheduleFor === 'teacher'
                        ? data.teacherId && (
                              <span style={{ fontSize: 10, fontWeight: 700, color: green['900'] }}>
                                  {' ['}
                                  {((e?: string) =>
                                      e
                                          ?.split(' ')
                                          .map((e, i) => /* i === 0 ? e.slice(0, 5) : */ e[0])
                                          .join('.')
                                          .trim())(
                                      data.teacherName /* || teachers?.find((e) => e.id === data.teacherId)?.name */,
                                  ) || data.teacherId}
                                  {']'}
                              </span>
                          )
                        : data.scheduleFor === 'audience'
                        ? data.audienceName_ && (
                              <span style={{ fontSize: 10, fontWeight: 700, color: green['900'] }}>
                                  {' '}
                                  [{data.audienceName_}
                                  {data.additionalAuditoryName && `/${data.additionalAuditoryName}`}]
                              </span>
                          )
                        : null}{' '}
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
                        {data.additionalAuditoryName && `/${data.additionalAuditoryName}`}
                    </div>
                )}
                {data.scheduleFor !== 'teacher' && (data.teacherName || data.additionalTeacherName) && (
                    <div className={classNames(dxClasses.text, dxClasses.content)}>
                        • Преподаватель: {data.teacherName}
                        {data.additionalTeacherName && `/${data.additionalTeacherName}`}
                    </div>
                )}
                {data.scheduleFor !== 'group' && data.groups && data.groups.length > 0 && (
                    <div className={classNames(dxClasses.text, dxClasses.content)}>
                        • Группы: {data.groups.join(', ')}
                    </div>
                )}
                {data.isDivision && <div className={classNames(dxClasses.text, dxClasses.content)}>• По П/Г</div>}
                {data.isStream && <div className={classNames(dxClasses.text, dxClasses.content)}>• В потоке</div>}
            </div>
        </StyledAppointmentsAppointmentContent>
    );
};

const AppointmentTooltipContent = ({ children, appointmentData, ...restProps }: AppointmentTooltipContentProps) => (
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
        {appointmentData.scheduleFor !== 'teacher' && appointmentData.teacherName && (
            <Grid container alignItems="center">
                <StyledGrid item xs={2} className={dxClasses.textCenter}>
                    <StyledIcon className={dxClasses.icon}>
                        <TeacherIcon />
                    </StyledIcon>
                </StyledGrid>
                <Grid item xs={10}>
                    <span>
                        {appointmentData.teacherName}
                        {appointmentData.additionalTeacherName && `/${appointmentData.additionalTeacherName}`}
                    </span>
                </Grid>
            </Grid>
        )}
        {appointmentData.groups &&
            (appointmentData.scheduleFor !== 'group' || appointmentData.groups.length > 1) &&
            appointmentData.groups.length > 0 && (
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

const getFlexibleSpace =
    (scheduleFor: ScheduleFor) =>
    ({ ...props }: Toolbar.FlexibleSpaceProps) =>
        (
            <StyledToolbarFlexibleSpace {...props} className={dxClasses.flexibleSpace}>
                <LessonFilter />
                <LessonTypeSelector />
                <GroupGroupingControl scheduleFor={scheduleFor} />
            </StyledToolbarFlexibleSpace>
        );

const getResources = (scheduleFor: ScheduleFor, selectedItems: (number | string)[] = []) => {
    const resources: Resource[] = [];
    if (scheduleFor === 'group') {
        resources.push({
            fieldName: 'group',
            title: 'Группа',
            instances: selectedItems.map((name, i) => ({
                id: name,
                text: name as string,
                color: [green, blue, yellow, teal, red][i],
            })),
        });
    } else if (scheduleFor === 'teacher') {
        const teachers = getTeachers();
        resources.push({
            fieldName: 'teacherId',
            title: 'Преподаватель',
            instances: selectedItems.map((id, i) => ({
                id,
                text:
                    ((e?: string) =>
                        e
                            ?.split(' ')
                            .map((e, i) => /* i === 0 ? e.slice(0, 5) : */ e[0])
                            .join('.')
                            .trim())(teachers?.find((e) => e.id === (id as number))?.name) || `#${id}`,
                color: [green, blue, yellow, teal, red][i],
            })),
        });
    } else if (scheduleFor === 'audience') {
        resources.push({
            fieldName: 'auditoryName',
            title: 'Аудитория',
            instances: selectedItems.map((name, i) => ({
                id: name,
                text: String(name),
                color: [green, blue, yellow, teal, red][i],
            })),
        });
    }

    resources.push({
        fieldName: 'typeArr',
        title: 'Type',
        instances: [
            { id: LessonFlags.Lecture, text: 'Лекция', color: green },
            { id: LessonFlags.Practical, text: 'Практика', color: yellow },
            { id: LessonFlags.Labaratory, text: 'Лабораторная работа', color: blue },
            { id: LessonFlags.CourseProject, text: 'Курсовой проект', color: red },
            { id: LessonFlags.Consultation, text: 'Консультация', color: green },
            { id: LessonFlags.Test, text: 'Зачет', color: teal },
            { id: LessonFlags.DifferentiatedTest, text: 'Диф. зачет', color: red },
            { id: LessonFlags.Exam, text: 'Экзамен', color: red },
            { id: LessonFlags.Library, text: 'Библиотека', color: teal },
            { id: LessonFlags.ResearchWork, text: 'Научно-исследовательская работа', color: yellow },
            { id: LessonFlags.OrganizationalMeeting, text: 'Орг. собрание', color: yellow },
            { id: LessonFlags.Unsupported, text: 'N/A', color: yellow },
            // etc...
        ],
        allowMultiple: true,
    });
    return resources;
};

export type MaterialSchedulerProps = {
    scheduleFor: ScheduleFor;
};

const SchedulerContainer: React.FC<MaterialSchedulerProps> = (props) => {
    const { scheduleFor } = props;

    const dispatch = useDispatch();

    const {
        lessonTypes,
        lessonFilter = '',
        groupsSplitColor,
        groupingGroups,
        isGroupByDate,
        fetchingSchedule,
    } = useSelector((state) => state.schedule);

    const selectedItems = useSelector((state) => state.schedule.selectedItems[scheduleFor]);
    const scheduleData = useSelector((state) => state.schedule.scheduleData[scheduleFor]);

    const [data, setData] = React.useState<AppointmentModel[]>([]);

    React.useEffect(() => {
        if (!scheduleData) return;

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
                    const durationHours = endDate.diff(startDate, 'hours');
                    return {
                        ...e,
                        startDate: startDate.toDate(),
                        endDate: endDate.toDate(),
                        scheduleFor,
                        ...((durationDays > 0 || durationHours > 21) && { allDay: true }),
                        ...(scheduleFor === 'group'
                            ? isComparing && { group: data.itemKey as string }
                            : scheduleFor === 'teacher'
                            ? { teacherId: isComparing ? e.teacherId : undefined }
                            : isComparing && { audienceName_: e.auditoryName as string }),
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
                        dataItem.additionalAuditoryName?.toLowerCase()?.includes(lowerCaseFilter) ||
                        dataItem.additionalTeacherName?.toLowerCase()?.includes(lowerCaseFilter) ||
                        dataItem.teacherName?.toLowerCase()?.includes(lowerCaseFilter) ||
                        (scheduleFor !== 'group' &&
                            dataItem.groups?.join(', ')?.toLowerCase()?.includes(lowerCaseFilter)),
                ),
        [data, lessonTypes, lowerCaseFilter],
    );

    const mainResourceName =
        selectedItems.length > 1 && groupsSplitColor
            ? scheduleFor === 'group'
                ? 'group'
                : scheduleFor === 'teacher'
                ? 'teacherId'
                : 'auditoryName'
            : 'typeArr';
    const hasGroupingGroups = selectedItems.length > 1 && groupingGroups;

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
                    displayName="Месяц"
                    dayScaleCellComponent={DayScaleCell}
                    timeTableCellComponent={getTimeTableCell(hasGroupingGroups)}
                />
                <WeekView displayName="Неделя" startDayHour={6} endDayHour={23} excludedDays={[0]} />
                <DayView displayName="День" startDayHour={6} endDayHour={23} intervalCount={1} />
                <AllDayPanel titleCellComponent={TitleCellComponent} />

                <Appointments
                    appointmentComponent={Appointment as any}
                    appointmentContentComponent={AppointmentContent as any}
                />
                <AppointmentTooltip contentComponent={AppointmentTooltipContent as any} />
                <AppointmentForm readOnly />
                <Resources data={getResources(scheduleFor, selectedItems)} mainResourceName={mainResourceName} />

                <CurrentTimeIndicator shadePreviousCells shadePreviousAppointments updateInterval={60e3} />
                <Toolbar
                    {...(fetchingSchedule ? { rootComponent: ToolbarWithLoading } : null)}
                    flexibleSpaceComponent={getFlexibleSpace(scheduleFor)}
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

export default SchedulerContainer;
