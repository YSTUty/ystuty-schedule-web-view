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
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import { FilterContext } from './Filter.provider';
import { AudienceLesson } from '../../interfaces/ystuty.types';
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
        backgroundColor: theme.palette.action.selected,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));

const AudiencerCombinedTable = (props: {
    filterDateTime: {
        date1: Dayjs | null;
        date2: Dayjs | null;
        time1: Dayjs | null;
        time2: Dayjs | null;
    };
    isColoring: boolean;
}) => {
    const { filterDateTime, isColoring } = props;

    const { accumulatives, selectedAudiences, lessonTypes } = useSelector((state) => state.audiencer);
    const { filters } = React.useContext(FilterContext);
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const schedule = React.useMemo(() => {
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
            .filter((audience) => audience.items.length > 0)
            .reduce((acc, audience) => {
                const { name, items } = audience;
                acc.push(...items.map((e) => ({ ...e, audienceName: name })));
                return acc;
            }, [] as (AudienceLesson & { audienceName: string })[])
            .sort((a, b) => (dayjs(a.startAt).isAfter(b.startAt) ? 1 : -1));
    }, [accumulatives, filters, filterDateTime, selectedAudiences, lessonTypes]);

    const colorDate = lessonsUtils.hashColorTime(isDark);
    const colorTime = lessonsUtils.hashColorAudience(isDark);
    const colorAudience = lessonsUtils.hashColorAudience(isDark);

    if (accumulatives.length === 0) {
        return (
            <Container sx={{ width: '100%' }}>
                <Typography>Loading accumulatives...</Typography>
                <LinearProgress color="secondary" />
            </Container>
        );
    }

    // return <pre>{JSON.stringify(schedule.length)}</pre>;

    return (
        <>
            <Typography component="pre" align="center" sx={{ pb: 2 }}>
                Displayed: [schedule: {schedule.length};]
            </Typography>

            <Box component="main" sx={{ pb: 2, px: { xs: 1, md: 4, lg: 10 }, width: '100%', overflow: 'hidden' }}>
                <TableContainer component={Paper} /* sx={{ maxHeight: 'calc(100vh - 45px)' }} */>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                <StyledTableCell>Дата</StyledTableCell>
                                <StyledTableCell>Время</StyledTableCell>
                                <StyledTableCell>Группы</StyledTableCell>
                                <StyledTableCell>Предмет</StyledTableCell>
                                <StyledTableCell>Вид занятий</StyledTableCell>
                                <StyledTableCell>Преподаватель</StyledTableCell>
                                <StyledTableCell align="right">Audience</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {schedule.map((lesson) => {
                                const key = lesson.audienceName + new Date(lesson.startAt).toString();
                                const fDate = dayjs(lesson.startAt).locale('ru').format('DD.MM dd');
                                const fTime1 = dayjs(lesson.startAt).format('HH:mm');
                                const fTime2 = dayjs(lesson.endAt).format('HH:mm');

                                return (
                                    <StyledTableRow hover sx={{ '& > *': { borderBottom: 'unset' } }} key={key}>
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
                                                    (isColoring && colorAudience.hex(lesson.lessonName || 'none')) ||
                                                    null,
                                            }}
                                        >
                                            {lesson.lessonName}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {lessonsUtils.getLessonTypeStrArr(lesson.lessonType).join(', ')}
                                        </StyledTableCell>
                                        <StyledTableCell>{lesson.teacherName}</StyledTableCell>
                                        <StyledTableCell
                                            align="right"
                                            sx={{
                                                backgroundColor:
                                                    (isColoring && colorAudience.hex(lesson.audienceName)) || null,
                                            }}
                                        >
                                            {lesson.audienceName}
                                        </StyledTableCell>
                                    </StyledTableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        </>
    );
};

export default AudiencerCombinedTable;
