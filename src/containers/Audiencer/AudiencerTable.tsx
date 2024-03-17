import React from 'react';
import { useSelector } from 'react-redux';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

import { styled, useTheme } from '@mui/material/styles';
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

import { FilterContext } from './Filter.provider';
import { AccumulativeSchedule } from '../../interfaces/ystuty.types';
import * as lessonsUtils from '../../utils/lessons.utils';
import * as audiencerUtils from '../../utils/audiencer.utils';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

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

const RowAccumulative = (props: { row: AccumulativeSchedule; isColoring: boolean }) => {
    const { row, isColoring } = props;
    const [open, setOpen] = React.useState(false);

    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const colorDate = lessonsUtils.hashColorTime(isDark);
    const colorTime = lessonsUtils.hashColorAudience(isDark);
    const colorAudience = lessonsUtils.hashColorAudience(isDark);

    return (
        <>
            <StyledTableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <StyledTableCell>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowRight />}
                    </IconButton>
                </StyledTableCell>
                <StyledTableCell component="th" scope="row">
                    {row.id}
                </StyledTableCell>
                <StyledTableCell align="right">{row.name}</StyledTableCell>
            </StyledTableRow>

            <TableRow>
                <TableCell sx={{ pb: 0, pt: 0 }} colSpan={3}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Расписание
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>Дата</StyledTableCell>
                                        <StyledTableCell>Время</StyledTableCell>
                                        <StyledTableCell>Группы</StyledTableCell>
                                        <StyledTableCell>Предмет</StyledTableCell>
                                        <StyledTableCell>Вид занятий</StyledTableCell>
                                        <StyledTableCell>Преподаватель</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.items.map((lesson) => {
                                        const fDate = dayjs(lesson.startAt).locale('ru').format('DD.MM dd');
                                        const fTime1 = dayjs(lesson.startAt).format('HH:mm');
                                        const fTime2 = dayjs(lesson.endAt).format('HH:mm');

                                        return (
                                            <StyledTableRow key={new Date(lesson.startAt).toString()}>
                                                <StyledTableCell
                                                    component="th"
                                                    scope="row"
                                                    sx={{
                                                        minWidth: 90,
                                                        backgroundColor: (isColoring && colorDate.hex(fDate)) || null,
                                                    }}
                                                >
                                                    {fDate}
                                                </StyledTableCell>
                                                <StyledTableCell
                                                    sx={{
                                                        minWidth: 110,
                                                        backgroundColor: (isColoring && colorTime.hex(fTime1)) || null,
                                                    }}
                                                >
                                                    {fTime1}-{fTime2}
                                                </StyledTableCell>
                                                <StyledTableCell>{lesson.groups.join(', ')}</StyledTableCell>
                                                <StyledTableCell
                                                    sx={{
                                                        backgroundColor:
                                                            (isColoring &&
                                                                colorAudience.hex(lesson.lessonName || 'none')) ||
                                                            null,
                                                    }}
                                                >
                                                    {lesson.lessonName}
                                                </StyledTableCell>
                                                <StyledTableCell>
                                                    {lessonsUtils.getLessonTypeStrArr(lesson.type).join(', ')}
                                                </StyledTableCell>
                                                <StyledTableCell
                                                    align="right"
                                                    sx={{
                                                        backgroundColor:
                                                            (isColoring &&
                                                                colorAudience.hex(lesson.teacherName || 'none')) ||
                                                            null,
                                                    }}
                                                >
                                                    {lesson.teacherName}
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </>
    );
};

const AudiencerTable = (props: {
    filterDateTime: {
        date1: Dayjs | null;
        date2: Dayjs | null;
        time1: Dayjs | null;
        time2: Dayjs | null;
    };
    isColoring: boolean;
}) => {
    const { filterDateTime } = props;

    const { selectedAudiences, accumulatives, lessonTypes, audiences } = useSelector((state) => state.audiencer);
    const { filters } = React.useContext(FilterContext);

    const showAudiences = !true;

    const filteredAcc = React.useMemo(() => {
        const selectedAudiencesArr = selectedAudiences.map((e) => e.toLowerCase());
        const filterAudienceArr = filters.audience.value
            .toLowerCase()
            .split(',')
            .map((item) => item.trim());
        const filterNames = [...filterAudienceArr, ...selectedAudiencesArr];

        return accumulatives
            .map(audiencerUtils.fixAudienceName)
            .filter((audience) => filterNames.some((e) => audience.name.toLowerCase().includes(e)))
            .map(audiencerUtils.filterByDateTime(filterDateTime))
            .map(audiencerUtils.filterByLessonArray(filters.lesson.value))
            .map(audiencerUtils.filterByLessonType(lessonTypes))

            .filter((audience) => audience.items.length > 0);
    }, [accumulatives, filters, filterDateTime, lessonTypes]);

    if (accumulatives.length === 0) {
        return (
            <Container sx={{ width: '100%' }}>
                <Typography>Loading accumulatives...</Typography>
                <LinearProgress color="secondary" />
            </Container>
        );
    }

    // return <pre>{JSON.stringify(filteredAcc.map((e) => e.items.length))}</pre>;

    return (
        <>
            <Typography component="pre" align="center" sx={{ pb: 2 }}>
                Displayed: [audience: {filteredAcc.length}; scheduel:{' '}
                {filteredAcc.reduce((p, c) => p + c.items.length, 0)}]
            </Typography>

            <Box component="main" sx={{ pb: 2, px: { xs: 1, md: 4, lg: 10 }, width: '100%', overflow: 'hidden' }}>
                <TableContainer component={Paper} /* sx={{ maxHeight: 'calc(100vh - 45px)' }} */>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                <StyledTableCell />
                                <StyledTableCell>ID</StyledTableCell>
                                <StyledTableCell align="right">Name</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredAcc.map((row) => (
                                <RowAccumulative key={row.id} row={row} isColoring={props.isColoring} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {audiences.length > 0 && (
                <Container component="main" maxWidth="sm" sx={{ pb: 2, pt: 2, width: '100%', overflow: 'hidden' }}>
                    <TableContainer component={Paper} sx={{ maxHeight: 'calc(100vh - 45px - 80px)' }}>
                        <Table stickyHeader size="small">
                            <Collapse in={showAudiences} timeout="auto" unmountOnExit>
                                <TableHead>
                                    <TableRow>
                                        <StyledTableCell>ID</StyledTableCell>
                                        <StyledTableCell>Name</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {audiences.map((row) => (
                                        <StyledTableRow key={row.name}>
                                            <StyledTableCell component="th" scope="row">
                                                {row.id}
                                            </StyledTableCell>
                                            <StyledTableCell>{row.name}</StyledTableCell>
                                        </StyledTableRow>
                                    ))}
                                </TableBody>
                            </Collapse>
                        </Table>
                    </TableContainer>
                </Container>
            )}
        </>
    );
};

export default AudiencerTable;
