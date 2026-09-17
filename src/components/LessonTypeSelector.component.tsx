import classNames from 'clsx';

import { alpha, styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';

import { LessonFlags } from '@/interfaces/schedule';
import { useDispatch, useSelector } from '@/store';
import audiencerSlice from '@/store/reducer/audiencer/audiencer.slice';
import scheduleSlice from '@/store/reducer/schedule/schedule.slice';

const PREFIX = 'LTS';

const classes = {
  locationSelector: `${PREFIX}-locationSelector`,
  button: `${PREFIX}-button`,
  selectedButton: `${PREFIX}-selectedButton`,
  longButtonText: `${PREFIX}-longButtonText`,
  shortButtonText: `${PREFIX}-shortButtonText`,
};

const StyledButtonGroup = styled(ToggleButtonGroup)(
  ({ theme: { spacing, palette } }) => ({
    [`&.${classes.locationSelector}`]: {
      marginLeft: spacing(1),
      height: spacing(4.875),
    },
    [`& .${classes.longButtonText}`]: {
      '@media (max-width: 1200px)': {
        display: 'none',
      },
    },
    [`& .${classes.shortButtonText}`]: {
      '@media (min-width: 1200px)': {
        display: 'none',
      },
    },
    [`& .${classes.button}`]: {
      paddingLeft: spacing(1),
      paddingRight: spacing(1),
      width: spacing(12),
      '@media (max-width: 1200px)': {
        width: spacing(2),
        fontSize: '0.75rem',
      },
      '@media (max-width: 800px)': {
        width: spacing(1),
        fontSize: '0.70rem',
      },
      '@media (max-width: 600px)': {
        display: 'none',
      },
    },
    [`& .${classes.button}.${classes.selectedButton}`]: {
      backgroundColor: alpha(palette.primary.main, 0.85),
      borderColor: `${palette.primary.main}!important`,
      color: palette.primary.contrastText,
      '&:hover': {
        backgroundColor: palette.primary.dark,
      },
      '&.Mui-selected': {
        backgroundColor: alpha(palette.primary.main, 0.85),
        color: palette.primary.contrastText,
        '&:hover': {
          backgroundColor: palette.primary.dark,
        },
      },
    },
  }),
);

const LESSON_TYPES = [
  LessonFlags.Lecture,
  LessonFlags.Labaratory,
  LessonFlags.Practical,
  LessonFlags.CourseProject,
  LessonFlags.Consultation,
  LessonFlags.Test,
  LessonFlags.DifferentiatedTest,
  LessonFlags.Exam,
  LessonFlags.Library,
  LessonFlags.ResearchWork,
  LessonFlags.OrganizationalMeeting,
  LessonFlags.Practice,
  LessonFlags.Event,
  LessonFlags.MilitaryTraining,
  LessonFlags.PhysicalTraining,
  LessonFlags.Elective,
  LessonFlags.External,
  LessonFlags.Tenzor,
  LessonFlags.School21,
  LessonFlags.Unsupported,
];
const LESSON_TYPE_SHORT_NAMES = [
  'Лек',
  'ЛР',
  'ПР',
  'КП',
  'КОН',
  'ЗАЧ',
  'ДИФ',
  'ЭКЗ',
  'БИБЛ',
  'НИР',
  'Соб',
  'Прак',
  'Соб',
  'ВУЦ',
  'Физ',
  'Фак',
  'Внеш',
  'Тенз',
  'Ш21',
  'N/A',
];
const LESSON_TYPE_NAMES = [
  'Лекции',
  'Лабы',
  'Практики',
  'Курсовые',
  'Консультации',
  'Зачеты',
  'Диф. зачеты',
  'Экзамены',
  'Библиотека',
  'НИР',
  'Орг. собрание',
  'Практика',
  'Событие',
  'ВУЦ',
  'Физ. культура',
  'Факультатив',
  'Внешнее занятие',
  'Тензор',
  'Школа 21',
  'Другое',
];

const getButtonClass = (lessonTypes: LessonFlags[], type: LessonFlags) =>
  lessonTypes.includes(type) && classes.selectedButton;

const LessonTypeSelector = (props: { isAudiencer?: boolean }) => {
  let { lessonTypes, allowedLessonTypes } = useSelector(
    (state) => state.schedule,
  );
  const audiencerState = useSelector((state) => state.audiencer);
  const dispatch = useDispatch();

  if (props.isAudiencer) {
    allowedLessonTypes = LESSON_TYPES;
    lessonTypes = audiencerState.lessonTypes;
  }

  // TODO: add drop-down list for mobile
  return (
    <StyledButtonGroup className={classes.locationSelector}>
      {LESSON_TYPES.map(
        (type, index) =>
          !allowedLessonTypes ||
          (allowedLessonTypes.includes(type) && (
            <ToggleButton
              className={classNames(
                classes.button,
                /* classes.longButtonText, */ getButtonClass(lessonTypes, type),
              )}
              selected={lessonTypes.includes(type)}
              onClick={() =>
                dispatch(
                  (props.isAudiencer
                    ? audiencerSlice
                    : scheduleSlice
                  ).actions.toggleSelectedTypeLessons(type),
                )
              }
              key={type}
              value={String(type)}>
              <span className={classes.shortButtonText}>
                {LESSON_TYPE_SHORT_NAMES[index]}
              </span>
              <span className={classes.longButtonText}>
                {LESSON_TYPE_NAMES[index]}
              </span>
            </ToggleButton>
          )),
      )}
    </StyledButtonGroup>
  );
};

export default LessonTypeSelector;
