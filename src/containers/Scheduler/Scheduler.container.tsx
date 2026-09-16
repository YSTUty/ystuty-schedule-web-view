import React from 'react';
import classNames from 'clsx';
import dayjs from 'dayjs';

import {
  Color,
  GroupingState,
  IntegratedGrouping,
  Resource,
  SchedulerDateTime,
  ValidResourceInstance,
  ViewState,
} from '@devexpress/dx-react-scheduler';
import {
  AllDayPanel,
  Appointments,
  AppointmentTooltip,
  CurrentTimeIndicator,
  DateNavigator,
  DayView,
  GroupingPanel,
  MonthView,
  Resources,
  Scheduler,
  TodayButton,
  Toolbar,
  ViewSwitcher,
  WeekView,
} from '@devexpress/dx-react-scheduler-material-ui';

import Badge from '@mui/material/Badge';
import Box from '@mui/material/Box';
import { blue, green, red, teal, yellow } from '@mui/material/colors';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LessonIcon from '@mui/icons-material/BookRounded';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import StreamGroupsIcon from '@mui/icons-material/Groups';
import GroupsIcon from '@mui/icons-material/Groups2';
import InfoIcon from '@mui/icons-material/Info';
import TimeIcon from '@mui/icons-material/MoreTime';
import OnlinePredictionIcon from '@mui/icons-material/OnlinePrediction';
import DivisionGroupsIcon from '@mui/icons-material/PeopleOutlined';
import TeacherIcon from '@mui/icons-material/PermIdentity';
import RoomIcon from '@mui/icons-material/Room';
import StorageOutlinedIcon from '@mui/icons-material/StorageOutlined';

import GroupGroupingControl from '@components/GroupGroupingControl.component';
import LessonFilter from '@components/LessonFilter.component';
import LessonTypeSelector from '@components/LessonTypeSelector.component';
import { getTeachers } from '@components/SelectTeacher.component';
import * as lessonsUtils from '@/utils/lessons.utils';
import { LessonFlags, WeekParityType } from '@/interfaces/schedule';
import { ScheduleFor } from '@/interfaces/ystuty.types';
import { useDispatch, useSelector } from '@/store';
import { selectScheduleItems } from '@/store/reducer/schedule/schedule.selectors';
import scheduleSlice from '@/store/reducer/schedule/schedule.slice';
import {
  MergedLessonData,
  mergeMassLessonVariants,
} from '@/utils/schedule-variants.utils';
import {
  DayScaleCell,
  classes as dxClasses,
  getTimeTableCell,
  StyledAppointmentsAppointment,
  StyledAppointmentsAppointmentContent,
  StyledToolbarFlexibleSpace,
  ToolbarWithLoading,
} from './dx.components';

export interface AppointmentModel extends MergedLessonData {
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
  /**
   * Свойство передаётся AppointmentTooltip в рантайме, но отсутствует в
   * декларации ContentProps пакета dx-react-scheduler 3.0.5.
   */
  appointmentResources?: ValidResourceInstance[];
};

type TooltipRowProps = {
  children: React.ReactNode;
  color?: string;
  icon: React.ReactNode;
};

const timeFormatOptions = {
  hour: '2-digit',
  minute: '2-digit',
} as const;

const dateFormatOptions = {
  day: 'numeric',
  month: 'long',
  weekday: 'long',
} as const;

const getTooltipResourceColor = (color?: string | Color) => {
  if (typeof color === 'string') {
    return color;
  }

  return color?.[300] ?? green[300];
};

const getAppointmentTeacherNames = (
  data: Pick<
    AppointmentModel,
    'additionalTeacherName' | 'mergedTeacherNames' | 'teacherName'
  >,
) =>
  data.mergedTeacherNames ??
  [data.teacherName, data.additionalTeacherName].filter(
    (teacherName): teacherName is string => Boolean(teacherName),
  );

const TooltipRow = ({ children, color, icon }: TooltipRowProps) => (
  <Grid container sx={{ alignItems: 'center', pb: 1.25 }}>
    <Grid
      size={2}
      sx={{
        color: color ?? 'action.active',
        display: 'flex',
        justifyContent: 'center',
      }}>
      {icon}
    </Grid>
    <Grid size={10}>
      <Typography component="div" variant="body2">
        {children}
      </Typography>
    </Grid>
  </Grid>
);

/**
 * В dx-react-scheduler 3.0.5 children не отражены в типе material-компонента,
 * хотя библиотека использует их для подключения плагинов Scheduler.
 */
const SchedulerWithPlugins = Scheduler as React.ComponentType<
  React.PropsWithChildren<React.ComponentProps<typeof Scheduler>>
>;

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

const AppointmentContent = ({
  data,
  ...restProps
}: AppointmentContentProps) => {
  const teacherNames = getAppointmentTeacherNames(data);
  let title = '';
  if (data.number) {
    title += `#${data.number}`;
  }

  if (data.group && data.scheduleFor === 'group') {
    title += ` [${data.group}]`;
  } else if (data.teacherId && data.scheduleFor === 'teacher') {
    title += ` [${
      data.teacherName ||
      /* teachers?.find((e) => e.id === data.teacherId)?.name || */ data.teacherId
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
  if (teacherNames.length > 0) {
    title += `• ${data.mergedVariantsCount ? 'Преподаватели' : 'Преподаватель'}: ${teacherNames.join(', ')}\n`;
  }

  if (data.isDivision) {
    title += `• По П/Г\n`;
  }
  if (data.isStream) {
    title += `• В потоке\n`;
  }
  if (data.subInfo) {
    title += `• Есть доп. инфа...\n`;
  }
  if (data.isDistant) {
    title += `• Дистант 📡\n`;
  }

  return (
    <StyledAppointmentsAppointmentContent
      {...restProps}
      data={data}
      title={title}>
      <div className={dxClasses.container}>
        {/* Дисциплина */}
        <div className={dxClasses.text}>
          {data.number && <>#{data.number}</>}
          {data.scheduleFor === 'group'
            ? data.group && (
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color: green['900'],
                  }}>
                  {' '}
                  [{data.group}]
                </span>
              )
            : data.scheduleFor === 'teacher'
              ? data.teacherId && (
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: green['900'],
                    }}>
                    {' ['}
                    {((e?: string) =>
                      e
                        ?.split(' ')
                        .map((e) => /* i === 0 ? e.slice(0, 5) : */ e[0])
                        .join('.')
                        .trim())(
                      data.teacherName /* || teachers?.find((e) => e.id === data.teacherId)?.name */,
                    ) || data.teacherId}
                    {']'}
                  </span>
                )
              : data.scheduleFor === 'audience'
                ? data.audienceName_ && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: green['900'],
                      }}>
                      {' '}
                      [{data.audienceName_}
                      {data.additionalAuditoryName &&
                        `/${data.additionalAuditoryName}`}
                      ]
                    </span>
                  )
                : null}{' '}
          {data.title}
        </div>
        {data.timeRange && (
          <div className={dxClasses.text}>🕑 {data.timeRange}</div>
        )}
        {data.type !== 0 && (
          <div className={classNames(dxClasses.text, dxClasses.content)}>
            • Вид занятий:{' '}
            {lessonsUtils.getLessonTypeStrArr(data.type).join(', ')}
          </div>
        )}
        {data.auditoryName && (
          <div className={classNames(dxClasses.text, dxClasses.content)}>
            • Аудитория: {data.auditoryName}
            {data.additionalAuditoryName && `/${data.additionalAuditoryName}`}
          </div>
        )}
        {data.scheduleFor !== 'teacher' &&
          teacherNames.length > 0 &&
          (data.mergedVariantsCount ? (
            <>
              <div className={classNames(dxClasses.text, dxClasses.content)}>
                • Преподаватели:
              </div>
              {teacherNames.map((teacherName) => (
                <div
                  className={classNames(dxClasses.text, dxClasses.content)}
                  key={teacherName}>
                  • {teacherName}
                </div>
              ))}
            </>
          ) : (
            <div className={classNames(dxClasses.text, dxClasses.content)}>
              • Преподаватель: {teacherNames.join(', ')}
            </div>
          ))}
        {data.scheduleFor !== 'group' &&
          data.groups &&
          data.groups.length > 0 && (
            <div className={classNames(dxClasses.text, dxClasses.content)}>
              • Группы: {data.groups.join(', ')}
            </div>
          )}
        {data.isDivision && (
          <div className={classNames(dxClasses.text, dxClasses.content)}>
            • По П/Г
          </div>
        )}
        {data.isStream && (
          <div className={classNames(dxClasses.text, dxClasses.content)}>
            • В потоке
          </div>
        )}
        {data.subInfo && (
          <div className={classNames(dxClasses.text, dxClasses.content)}>
            • <b>Есть доп. инфа...</b>
          </div>
        )}
      </div>
    </StyledAppointmentsAppointmentContent>
  );
};

const AppointmentTooltipContent = ({
  children,
  appointmentData,
  appointmentResources = [],
  formatDate,
  recurringIconComponent: RecurringIcon,
}: AppointmentTooltipContentProps) => {
  const teacherNames = getAppointmentTeacherNames(appointmentData);

  return (
    <Box sx={{ bgcolor: 'background.paper', lineHeight: 1.4, p: 2 }}>
      <Grid container sx={{ alignItems: 'flex-start', pb: 2 }}>
        <Grid
          size={2}
          sx={{ display: 'flex', justifyContent: 'center', pt: 0.25 }}>
          <Box sx={{ height: 36, position: 'relative', width: 36 }}>
            <Box
              sx={{
                bgcolor: getTooltipResourceColor(
                  appointmentResources[0]?.color,
                ),
                borderRadius: '50%',
                height: '100%',
                width: '100%',
              }}
            />
            {appointmentData.rRule && (
              <Box
                sx={{
                  color: 'background.paper',
                  inset: 0,
                  position: 'absolute',
                }}>
                <RecurringIcon />
              </Box>
            )}
          </Box>
        </Grid>
        <Grid size={10}>
          <Typography sx={{ fontWeight: 500, lineHeight: 1.25 }}>
            {appointmentData.title}
          </Typography>
          <Typography color="text.secondary" variant="body2">
            {formatDate(appointmentData.startDate, dateFormatOptions)}
          </Typography>
        </Grid>
      </Grid>

      <TooltipRow icon={<AccessTimeIcon />}>
        <Typography variant="body2">
          {formatDate(appointmentData.startDate, timeFormatOptions)} –{' '}
          {formatDate(appointmentData.endDate, timeFormatOptions)}
        </Typography>
      </TooltipRow>

      {appointmentResources.map((resource) => (
        <TooltipRow
          icon={
            <Box
              sx={{
                bgcolor: getTooltipResourceColor(resource.color),
                borderRadius: '50%',
                height: 12,
                width: 12,
              }}
            />
          }
          key={`${resource.fieldName}_${resource.id}`}>
          {resource.text}
        </TooltipRow>
      ))}

      {appointmentData.isDistant && (
        <TooltipRow color={red[800]} icon={<OnlinePredictionIcon />}>
          Дистант
        </TooltipRow>
      )}
      {appointmentData.auditoryName && (
        <TooltipRow icon={<RoomIcon />}>
          <b>{appointmentData.auditoryName}</b>
        </TooltipRow>
      )}
      {appointmentData.duration > 2 && (
        <TooltipRow icon={<TimeIcon />}>
          Продолжительность: <b>{appointmentData.duration} ч</b>
        </TooltipRow>
      )}
      {appointmentData.type !== 0 && (
        <TooltipRow icon={<LessonIcon />}>
          Вид занятий:{' '}
          <b>
            {lessonsUtils.getLessonTypeStrArr(appointmentData.type).join(', ')}
          </b>
        </TooltipRow>
      )}
      {appointmentData.isStream && (
        <TooltipRow icon={<StreamGroupsIcon />}>В потоке</TooltipRow>
      )}
      {appointmentData.isDivision && (
        <TooltipRow icon={<DivisionGroupsIcon />}>По П/Г</TooltipRow>
      )}
      {appointmentData.scheduleFor !== 'teacher' && teacherNames.length > 0 && (
        <TooltipRow icon={<TeacherIcon />}>
          {appointmentData.mergedVariantsCount ? (
            <Box>
              <Typography component="span" variant="body2">
                Преподаватели:
              </Typography>
              <Box component="ul" sx={{ mb: 0, mt: 0.5, pl: 2.25 }}>
                {teacherNames.map((teacherName) => (
                  <li key={teacherName}>{teacherName}</li>
                ))}
              </Box>
            </Box>
          ) : (
            teacherNames.join('/')
          )}
        </TooltipRow>
      )}
      {appointmentData.groups &&
        (appointmentData.scheduleFor !== 'group' ||
          appointmentData.groups.length > 1) &&
        appointmentData.groups.length > 0 && (
          <TooltipRow icon={<GroupsIcon />}>
            {appointmentData.groups.join(', ')}
          </TooltipRow>
        )}
      {appointmentData.subInfo && (
        <TooltipRow icon={<InfoIcon />}>
          {appointmentData.subInfo.startsWith('http') ? (
            <a
              href={appointmentData.subInfo}
              target="_blank"
              rel="noopener noreferrer">
              <i>
                <b>{appointmentData.subInfo}</b>
              </i>
            </a>
          ) : (
            <i>
              <b>{appointmentData.subInfo}</b>
            </i>
          )}
        </TooltipRow>
      )}
      {appointmentData.parity !== WeekParityType.CUSTOM && (
        <TooltipRow icon={<CalendarTodayIcon />}>
          Только на{' '}
          <b>
            {appointmentData.parity === WeekParityType.EVEN ? '' : 'не'}четной
          </b>{' '}
          неделе
        </TooltipRow>
      )}
      {!1 && isDev && (
        <TooltipRow icon={<InfoIcon />}>
          <code>{JSON.stringify(appointmentData)}</code>
        </TooltipRow>
      )}
      {children}
    </Box>
  );
};

const TitleCellComponent = () => (
  <AllDayPanel.TitleCell
    getMessage={(e) => (e === 'allDay' ? 'Весь день' : e)}
  />
);

const getFlexibleSpace =
  (
    scheduleFor: ScheduleFor,
    scheduleCached: boolean,
    scheduleServerCached: boolean,
  ) =>
  ({ ...props }: Toolbar.FlexibleSpaceProps) => (
    <StyledToolbarFlexibleSpace {...props} className={dxClasses.flexibleSpace}>
      <LessonFilter />
      <LessonTypeSelector />
      <GroupGroupingControl scheduleFor={scheduleFor} />
      {scheduleCached && (
        <Tooltip
          enterTouchDelay={0}
          leaveTouchDelay={2e3}
          title={
            <>
              Расписание показано из кэша браузера или API.
              {scheduleServerCached && <br />}
              {scheduleServerCached && '* кэш на сервере.'}
            </>
          }>
          <IconButton
            aria-label="Расписание из кэша"
            size="small"
            sx={{
              display: { xs: 'none', sm: 'inline-flex' },
              ml: 0.5,
              mr: 0.25,
              p: 0.5,
            }}>
            <Badge
              badgeContent="*"
              color="default"
              invisible={!scheduleServerCached}
              overlap="circular">
              <StorageOutlinedIcon fontSize="small" />
            </Badge>
          </IconButton>
        </Tooltip>
      )}
    </StyledToolbarFlexibleSpace>
  );

const getResources = (
  scheduleFor: ScheduleFor,
  selectedItems: (number | string)[] = [],
) => {
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
              .map((e) => /* i === 0 ? e.slice(0, 5) : */ e[0])
              .join('.')
              .trim())(teachers?.find((e) => e.id === (id as number))?.name) ||
          `#${id}`,
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
      {
        id: LessonFlags.ResearchWork,
        text: 'Научно-исследовательская работа',
        color: yellow,
      },
      {
        id: LessonFlags.OrganizationalMeeting,
        text: 'Орг. собрание',
        color: yellow,
      },
      { id: LessonFlags.Unsupported, text: 'N/A', color: yellow },
      // etc...
    ],
    allowMultiple: true,
  });
  return resources;
};

export type MaterialSchedulerProps = {
  scheduleCached: boolean;
  scheduleServerCached: boolean;
  scheduleFor: ScheduleFor | null;
};

const SchedulerContainer: React.FC<MaterialSchedulerProps> = (props) => {
  const { scheduleCached, scheduleFor, scheduleServerCached } = props;

  const dispatch = useDispatch();

  const {
    lessonTypes,
    lessonFilter = '',
    groupsSplitColor,
    groupingGroups,
    isGroupByDate,
    fetchingSchedule,
  } = useSelector((state) => state.schedule);

  const selectedItems = useSelector((state) =>
    selectScheduleItems(state, scheduleFor),
  );
  const scheduleData = useSelector(
    (state) => scheduleFor && state.schedule.scheduleData[scheduleFor],
  );

  const [data, setData] = React.useState<AppointmentModel[]>([]);

  React.useEffect(() => {
    if (!scheduleData || !scheduleFor) return;

    const isComparing = scheduleData.length > 1;
    const allowedLessonTypes: Partial<Record<LessonFlags, any>> = {};
    const data = [
      ...scheduleData.flatMap((data) =>
        mergeMassLessonVariants(data.data).map((e) => {
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
  }, [setData, scheduleFor, scheduleData]);

  const lowerCaseFilter = lessonFilter.toLowerCase();
  const dataMemo = React.useMemo(
    () =>
      data
        .filter(
          (item) =>
            lessonTypes.length < 1 ||
            lessonTypes.some((type) => item.typeArr.includes(type)),
        )
        .filter(
          (dataItem) =>
            dataItem.title?.toLowerCase()?.includes(lowerCaseFilter) ||
            dataItem.auditoryName?.toLowerCase()?.includes(lowerCaseFilter) ||
            dataItem.additionalAuditoryName
              ?.toLowerCase()
              ?.includes(lowerCaseFilter) ||
            dataItem.additionalTeacherName
              ?.toLowerCase()
              ?.includes(lowerCaseFilter) ||
            dataItem.teacherName?.toLowerCase()?.includes(lowerCaseFilter) ||
            (scheduleFor !== 'group' &&
              dataItem.groups
                ?.join(', ')
                ?.toLowerCase()
                ?.includes(lowerCaseFilter)),
        ),
    [data, lessonTypes, lowerCaseFilter],
  );

  if (!scheduleFor) {
    return null;
  }

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
      <SchedulerWithPlugins locale="ru" data={dataMemo} firstDayOfWeek={1}>
        <ViewState />
        {hasGroupingGroups && (
          <GroupingState
            grouping={[{ resourceName: mainResourceName }]}
            groupByDate={
              !isGroupByDate
                ? undefined
                : (viewName) => viewName === 'Week' || viewName === 'Month'
            }
          />
        )}

        <MonthView
          displayName="Месяц"
          dayScaleCellComponent={DayScaleCell}
          timeTableCellComponent={getTimeTableCell(hasGroupingGroups)}
        />
        <WeekView
          displayName="Неделя"
          startDayHour={6}
          endDayHour={23}
          excludedDays={[0]}
        />
        <DayView
          displayName="День"
          startDayHour={6}
          endDayHour={23}
          intervalCount={1}
        />
        <AllDayPanel titleCellComponent={TitleCellComponent} />

        <Appointments
          appointmentComponent={Appointment as any}
          appointmentContentComponent={AppointmentContent as any}
        />
        <AppointmentTooltip
          contentComponent={AppointmentTooltipContent as any}
        />
        {/*
          Редактирование расписания не поддерживается. AppointmentForm из
          dx-react-scheduler 3 использует несовместимый с MUI X 9 picker и
          открывается по двойному клику даже в режиме readOnly.
        */}
        <Resources
          data={getResources(scheduleFor, selectedItems)}
          mainResourceName={mainResourceName}
        />

        <CurrentTimeIndicator
          shadePreviousCells
          shadePreviousAppointments
          updateInterval={60e3}
        />
        <Toolbar
          {...(fetchingSchedule ? { rootComponent: ToolbarWithLoading } : null)}
          flexibleSpaceComponent={getFlexibleSpace(
            scheduleFor,
            scheduleCached,
            scheduleServerCached,
          )}
        />
        <DateNavigator />
        <ViewSwitcher />
        <TodayButton messages={{ today: 'Сегодня' }} />

        {hasGroupingGroups && <IntegratedGrouping />}
        {hasGroupingGroups && <GroupingPanel />}
      </SchedulerWithPlugins>
    </Paper>
  );
};

export default SchedulerContainer;
