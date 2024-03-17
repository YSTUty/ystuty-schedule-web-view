import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import LinearProgress from '@mui/material/LinearProgress';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import KeyboardArrowRight from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import scheduleSlice from '../../store/reducer/schedule/schedule.slice';
import * as lessonsUtils from '../../utils/lessons.utils';

import { LessonFlags, TeacherLessonData } from '../../interfaces/schedule';

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
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowRight />}
                    </IconButton>
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                    {row.lessonName}
                </StyledTableCell>
                <StyledTableCell align="right">{row.lessonCount}</StyledTableCell>
                <StyledTableCell align="right">{lessonsUtils.getLessonTypeStrArr(row.type).join(', ')}</StyledTableCell>
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
                                        <StyledTableCell align="right">Количество пар</StyledTableCell>
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
                                                                variant="inherit"
                                                            >
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

const TeacherLessonsTable: React.FC = () => {
    const dispatch = useDispatch();
    const {
        lessonTypes,
        lessonFilter = '',
        fetchingSchedule,
        teacherScheduleData: scheduleData,
    } = useSelector((state) => state.schedule);

    const [data, setData] = React.useState<TeacherLessonData[]>([]);

    React.useEffect(() => {
        const allowedLessonTypes: Partial<Record<LessonFlags, any>> = {};
        const data = [
            ...scheduleData.flatMap((data) =>
                data.data.map((e) => {
                    for (const type of e.typeArr) {
                        allowedLessonTypes[type] = true;
                    }
                    return e;
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
                .filter((dataItem) => dataItem.groups?.join(', ')?.toLowerCase()?.includes(lowerCaseFilter))
                .reduce((acc, item) => {
                    if (!(item.lessonName in acc)) {
                        acc[item.lessonName] = {
                            lessonName: item.lessonName,
                            lessonCount: 0,
                            groups: {},
                            type: LessonFlags.None,
                        };
                    }

                    let lesson = acc[item.lessonName];

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

                    for (const group of item.groups) {
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
                        lesson.groups[group][item.type]! += item.duration / 2;

                        // TODO: поправить подсчет: какие типы пар считать в количество? (экзамен/зачт тоже считается, а НИР? а другие какие?)
                        if (allowedTypes.some((e) => (item.type & e) === e)) {
                            lesson.lessonCount += item.duration / 2;
                        }
                    }

                    lesson.type |= item.type;

                    return acc;
                }, {} as Record<string, TeacherLessonType>),
        [data, lessonTypes, lowerCaseFilter],
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
        <Box component="main" sx={{ pb: 2, px: 10, width: '100%', overflow: 'hidden' }}>
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
                        {Object.values(dataMemo).map((row) => (
                            <RowAccumulative key={row.lessonName} row={row} />
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default TeacherLessonsTable;
