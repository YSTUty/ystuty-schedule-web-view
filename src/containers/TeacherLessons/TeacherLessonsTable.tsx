import React from 'react';

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import LinearProgress from '@mui/material/LinearProgress';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { filterByAcademicPeriod } from '@/utils/academic-period.utils';
import * as lessonsUtils from '@/utils/lessons.utils';
import { LessonData, LessonFlags } from '@/interfaces/schedule';
import { useDispatch, useSelector } from '@/store';
import scheduleSlice from '@/store/reducer/schedule/schedule.slice';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

type TeacherLessonType = {
  lessonName: string;
  lessonCount: number;
  groups: Record<string, Partial<Record<LessonFlags, number>>>;
  // groups: Record<string, number>;
  type: LessonFlags;
};

const RowAccumulative = (props: { row: TeacherLessonType }) => {
  const { row } = props;
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <StyledTableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowRight />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell component="th" scope="row">
          {row.lessonName}
        </StyledTableCell>
        <StyledTableCell align="right">{row.lessonCount}</StyledTableCell>
        <StyledTableCell align="right">
          {lessonsUtils.getLessonTypeStrArr(row.type).join(', ')}
        </StyledTableCell>
      </StyledTableRow>

      <TableRow>
        <TableCell sx={{ pb: 0, pt: 0 }} colSpan={2}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Группы
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <StyledTableCell>Группа</StyledTableCell>
                    <StyledTableCell align="right">
                      Количество пар
                    </StyledTableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {Object.entries(row.groups).map(([group, counter]) => (
                    <StyledTableRow key={group}>
                      <StyledTableCell>{group}</StyledTableCell>
                      <StyledTableCell align="right">
                        {Object.entries(counter)
                          .map(([type, count]) => (
                            <>
                              <Typography
                                style={{
                                  color: lessonsUtils.getLessonColor(
                                    Number(type),
                                  )[500],
                                }}
                                component="b"
                                variant="inherit">
                                [
                                {lessonsUtils
                                  .getLessonTypeStrArr(Number(type))
                                  .join(', ')}
                                ]
                              </Typography>
                              : {count}
                            </>
                          ))
                          // @ts-ignore
                          .reduce((prev, curr) => [prev, '; ', curr])}
                      </StyledTableCell>
                    </StyledTableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

const TeacherLessonsTable = (props: { academicPeriodId?: string }) => {
  const { academicPeriodId } = props;
  const dispatch = useDispatch();
  const {
    lessonTypes,
    lessonFilter = '',
    fetchingSchedule,
  } = useSelector((state) => state.schedule);
  const scheduleData = useSelector(
    (state) => state.schedule.scheduleData.teacher,
  );

  const data = React.useMemo<LessonData[]>(
    () => scheduleData?.flatMap((schedule) => schedule.data) ?? [],
    [scheduleData],
  );
  const filteredData = React.useMemo(
    () => filterByAcademicPeriod(data, academicPeriodId),
    [academicPeriodId, data],
  );

  React.useEffect(() => {
    const allowedLessonTypes: Partial<Record<LessonFlags, true>> = {};

    for (const lesson of filteredData) {
      for (const type of lesson.typeArr) {
        allowedLessonTypes[type] = true;
      }
    }

    dispatch(
      scheduleSlice.actions.setAllowedLessonTypes(
        Object.keys(allowedLessonTypes).map((e) => Number(e)) as LessonFlags[],
      ),
    );
  }, [dispatch, filteredData]);

  const lowerCaseFilter = lessonFilter.toLowerCase();
  const dataMemo = React.useMemo(
    () =>
      filteredData
        .filter(
          (item) =>
            lessonTypes.length < 1 ||
            lessonTypes.some((type) => item.typeArr.includes(type)),
        )
        .filter((dataItem) =>
          dataItem.groups?.join(', ')?.toLowerCase()?.includes(lowerCaseFilter),
        )
        .reduce(
          (acc, item) => {
            if (!item.lessonName) return acc;

            if (!(item.lessonName in acc)) {
              acc[item.lessonName] = {
                lessonName: item.lessonName,
                lessonCount: 0,
                groups: {},
                type: LessonFlags.None,
              };
            }

            let lesson = acc[item.lessonName];
            const lessonPairCount = lessonsUtils.getLessonPairCount(
              item.duration,
            );

            const allowedTypes = [
              LessonFlags.Lecture,
              LessonFlags.Practical,
              LessonFlags.Labaratory,
              LessonFlags.CourseProject,
              // LessonFlags.Consultation,
              LessonFlags.Test,
              LessonFlags.DifferentiatedTest,
              LessonFlags.Exam,
              LessonFlags.Library,
              LessonFlags.ResearchWork,
            ];

            for (const group of item.groups!) {
              // if (!(group in lesson.groups)) {
              //     lesson.groups[group] = 0;
              // }
              // ++lesson.groups[group];
              if (!(group in lesson.groups)) {
                lesson.groups[group] = {};
              }
              if (!(item.type in lesson.groups[group])) {
                lesson.groups[group][item.type] = 0;
              }
              lesson.groups[group][item.type]! += lessonPairCount;

              // TODO: поправить подсчет: какие типы пар считать в количество? (экзамен/зачт тоже считается, а НИР? а другие какие?)
              if (allowedTypes.some((e) => (item.type & e) === e)) {
                lesson.lessonCount += lessonPairCount;
              }
            }

            lesson.type |= item.type;

            return acc;
          },
          {} as Record<string, TeacherLessonType>,
        ),
    [filteredData, lessonTypes, lowerCaseFilter],
  );

  if (fetchingSchedule) {
    return (
      <Container sx={{ width: '100%' }}>
        <Typography>Loading teacher schedule...</Typography>
        <LinearProgress color="secondary" />
      </Container>
    );
  }

  // return <pre>{JSON.stringify(dataMemo, null, 2)}</pre>;

  return (
    <Box
      component="main"
      sx={{ pb: 2, px: 10, width: '100%', overflow: 'hidden' }}>
      <TableContainer component={Paper}>
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
              <StyledTableCell />
              <StyledTableCell>Предмет</StyledTableCell>
              <StyledTableCell align="right">Всего пар</StyledTableCell>
              <StyledTableCell align="right">Типы пар</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {Object.values(dataMemo).length > 0 ? (
              Object.values(dataMemo).map((row) => (
                <RowAccumulative key={row.lessonName} row={row} />
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} align="center">
                  За выбранный учебный период занятий не найдено.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default TeacherLessonsTable;
