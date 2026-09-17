import { useState } from 'react';
import classNames from 'clsx';

import Badge from '@mui/material/Badge';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { alpha, styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FilterListIcon from '@mui/icons-material/FilterList';

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
  mobileButton: `${PREFIX}-mobileButton`,
};

const StyledButtonGroup = styled(ToggleButtonGroup)(
  ({ theme: { spacing, palette } }) => ({
    [`&.${classes.locationSelector}`]: {
      flex: '0 1 auto',
      height: 'auto',
      margin: 0,
      maxWidth: '100%',
      overflowX: 'auto',
    },
    [`& .${classes.longButtonText}`]: {
      '@media (max-width: 1439.95px)': {
        display: 'none',
      },
    },
    [`& .${classes.shortButtonText}`]: {
      '@media (min-width: 1440px)': {
        display: 'none',
      },
    },
    [`& .${classes.button}`]: {
      flexShrink: 0,
      minWidth: spacing(11),
      paddingLeft: spacing(1),
      paddingRight: spacing(1),
      whiteSpace: 'nowrap',
      '@media (max-width: 1439.95px)': {
        minWidth: spacing(6),
        fontSize: '0.75rem',
      },
      '@media (max-width: 1023.95px)': {
        minWidth: spacing(5.5),
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

const MobileTypesButton = styled(Button)(({ theme: { spacing } }) => ({
  [`&.${classes.mobileButton}`]: {
    display: 'none',
    flexShrink: 0,

    '@media (max-width: 599.95px)': {
      display: 'inline-flex',
      marginLeft: 'auto',
      minWidth: spacing(8),
    },
  },
}));

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

const LessonTypeSelector = (props: { isAudiencer?: boolean }) => {
  let { lessonTypes, allowedLessonTypes } = useSelector(
    (state) => state.schedule,
  );
  const audiencerState = useSelector((state) => state.audiencer);
  const dispatch = useDispatch();
  const [menuAnchor, setMenuAnchor] = useState<HTMLElement | null>(null);

  if (props.isAudiencer) {
    allowedLessonTypes = LESSON_TYPES;
    lessonTypes = audiencerState.lessonTypes;
  }

  const visibleLessonTypes = LESSON_TYPES.filter(
    (type) => !allowedLessonTypes || allowedLessonTypes.includes(type),
  );
  const selectedVisibleTypes = visibleLessonTypes.filter((type) =>
    lessonTypes.includes(type),
  );
  const toggleLessonType = (type: LessonFlags) =>
    dispatch(
      (props.isAudiencer
        ? audiencerSlice
        : scheduleSlice
      ).actions.toggleSelectedTypeLessons(type),
    );

  return (
    <>
      <StyledButtonGroup className={classes.locationSelector}>
        {visibleLessonTypes.map((type) => {
          const index = LESSON_TYPES.indexOf(type);

          return (
            <ToggleButton
              className={classNames(
                classes.button,
                lessonTypes.includes(type) && classes.selectedButton,
              )}
              selected={lessonTypes.includes(type)}
              onClick={() => toggleLessonType(type)}
              key={type}
              value={String(type)}>
              <span className={classes.shortButtonText}>
                {LESSON_TYPE_SHORT_NAMES[index]}
              </span>
              <span className={classes.longButtonText}>
                {LESSON_TYPE_NAMES[index]}
              </span>
            </ToggleButton>
          );
        })}
      </StyledButtonGroup>
      <MobileTypesButton
        aria-controls={menuAnchor ? 'lesson-types-menu' : undefined}
        aria-expanded={Boolean(menuAnchor)}
        aria-haspopup="menu"
        className={classes.mobileButton}
        color="primary"
        onClick={(event) => setMenuAnchor(event.currentTarget)}
        startIcon={<FilterListIcon />}
        variant="outlined">
        <Badge
          badgeContent={selectedVisibleTypes.length}
          color="primary"
          max={99}
          showZero>
          Типы
        </Badge>
      </MobileTypesButton>
      <Menu
        anchorEl={menuAnchor}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        id="lesson-types-menu"
        onClose={() => setMenuAnchor(null)}
        open={Boolean(menuAnchor)}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}>
        {visibleLessonTypes.map((type) => {
          const index = LESSON_TYPES.indexOf(type);
          const selected = lessonTypes.includes(type);

          return (
            <MenuItem
              key={type}
              onClick={() => toggleLessonType(type)}
              selected={selected}>
              <Checkbox checked={selected} edge="start" tabIndex={-1} />
              <ListItemText primary={LESSON_TYPE_NAMES[index]} />
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

export default LessonTypeSelector;
