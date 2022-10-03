import React from 'react';
import { useSelector } from 'react-redux';
import dayjs, { Dayjs } from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import ColorHash from 'color-hash';

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
}) => {
    const {
        filterDateTime: { date1, date2, time1, time2 },
    } = props;

    const { accumulatives, selectedAudiences } = useSelector((state) => state.audiencer);
    const { filters } = React.useContext(FilterContext);
    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const schedule = React.useMemo(() => {
        const filterLessonArr = filters.lesson.value
            .toLowerCase()
            .split(',')
            .map((item) => item.trim());
        const selectedAudiencesArr = selectedAudiences.map((e) => e.toLowerCase());

        return accumulatives
            .filter((audience) => selectedAudiencesArr.some((e) => audience.name.toLowerCase().includes(e)))
            .map((audience) => {
                let { name, items } = audience;
                if (name === 'Актовый зал') {
                    name = 'А-АктовыйЗал';
                } else if (name === 'В-корпус_библиотека') {
                    name = 'В-Библиотека';
                }

                if (date1 || date2 || time1 || time2) {
                    items = items.filter((l) => {
                        let ok = true;
                        const startAt = dayjs(l.startAt);
                        const endAt = dayjs(l.endAt);
                        const startDate = startAt.startOf('day');
                        const startTime = dayjs(startAt.get('hour') + ':' + startAt.get('m'), 'HH:mm');
                        const endTime = dayjs(endAt.get('hour') + ':' + endAt.get('m'), 'HH:mm');

                        if (date1 && !startDate.isSameOrAfter(date1)) {
                            ok = false;
                        }
                        if (date2 && !startDate.isSameOrBefore(date2)) {
                            ok = false;
                        }
                        if (time1 && !startTime.isSameOrAfter(time1)) {
                            ok = false;
                        }
                        if (time2 && !endTime.isSameOrBefore(time2)) {
                            ok = false;
                        }
                        return ok;
                    });
                }

                return { ...audience, name, items };
            })
            .map((e) => ({
                ...e,
                items:
                    filterLessonArr.length === 0
                        ? e.items
                        : e.items.filter((item) =>
                              filterLessonArr.some(
                                  (e) =>
                                      // item.lessonName?.toLowerCase().includes(e)
                                      item.lessonName?.toLowerCase()?.includes(e) ||
                                      item.teacherName?.toLowerCase()?.includes(e) ||
                                      item.groups?.join(', ')?.toLowerCase()?.includes(e)
                              )
                          ),
            }))
            .filter((audience) => audience.items.length > 0)
            .reduce((acc, audience) => {
                const { name, items } = audience;
                acc.push(...items.map((e) => ({ ...e, audienceName: name })));
                return acc;
            }, [] as (AudienceLesson & { audienceName: string })[])
            .sort((a, b) => (dayjs(a.startAt).isAfter(b.startAt) ? 1 : -1));
    }, [accumulatives, filters, date1, date2, time1, time2, selectedAudiences]);

    const colorDate = new ColorHash({
        hue: { min: 90, max: 270 },
        lightness: isDark ? [0.35, 0.4, 0.5] : [0.4, 0.5, 0.65],
    });
    const colorTime = new ColorHash({
        hue: { min: 90, max: 180 },
        lightness: isDark ? [0.35, 0.4, 0.5] : [0.4, 0.5, 0.65],
    });
    const colorAudience = new ColorHash({
        lightness: isDark ? [0.35, 0.4, 0.5] : [0.4, 0.5, 0.65],
        saturation: isDark ? 0.5 : 0.8,
    });

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

            <Box component="main" /* maxWidth="xl" */ sx={{ pb: 2, px: 10, width: '100%', overflow: 'hidden' }}>
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
                                                backgroundColor: colorDate.hex(fDate),
                                            }}
                                        >
                                            {fDate}
                                        </StyledTableCell>
                                        <StyledTableCell
                                            sx={{
                                                minWidth: 110,
                                                backgroundColor: colorTime.hex(fTime1),
                                            }}
                                        >
                                            {fTime1}-{fTime2}
                                        </StyledTableCell>
                                        <StyledTableCell>{lesson.groups.join(', ')}</StyledTableCell>
                                        <StyledTableCell
                                            sx={{ backgroundColor: colorAudience.hex(lesson.lessonName || 'none') }}
                                        >
                                            {lesson.lessonName}
                                        </StyledTableCell>
                                        <StyledTableCell>
                                            {lessonsUtils.getLessonTypeStrArr(lesson.lessonType).join(', ')}
                                        </StyledTableCell>
                                        <StyledTableCell>{lesson.teacherName}</StyledTableCell>
                                        <StyledTableCell
                                            align="right"
                                            sx={{ backgroundColor: colorAudience.hex(lesson.audienceName) }}
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
