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
import * as lessonsUtils from '../../utils/lessons.utils';
import * as audiencerUtils from '../../utils/audiencer.utils';

import { AudienceLesson } from '../../interfaces/ystuty.types';

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

const RowAccumulative = (props: {
    row: {
        name: string;
        stats: {
            month: number;
            pairs: number;
        }[];
    };
    isColoring: boolean;
}) => {
    const { row, isColoring } = props;
    const [open, setOpen] = React.useState(row.stats.length < 12);

    const theme = useTheme();
    const isDark = theme.palette.mode === 'dark';

    const colorDate = lessonsUtils.hashColorDate(isDark);

    return (
        <>
            <StyledTableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <StyledTableCell align="left" sx={{ maxWidth: 90 }}>
                    <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowRight />}
                    </IconButton>
                </StyledTableCell>
                <StyledTableCell>{row.name}</StyledTableCell>
            </StyledTableRow>

            <TableRow>
                <TableCell sx={{ pb: 0, pt: 0 }} colSpan={2}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box sx={{ margin: 1 }}>
                            <Typography variant="h6" gutterBottom component="div">
                                Статистика аудитории {row.name}
                            </Typography>
                            <Table size="small" aria-label="purchases">
                                <TableHead>
                                    <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                        <StyledTableCell>Месяц</StyledTableCell>
                                        <StyledTableCell>Пары</StyledTableCell>
                                        <StyledTableCell>Часы</StyledTableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {row.stats.map((stat) => {
                                        const monthName = dayjs().month(stat.month).locale('ru').format('MMMM');
                                        const backgroundColor = (isColoring && colorDate.hex(monthName)) || null;

                                        return (
                                            <StyledTableRow
                                                hover
                                                sx={{ '& > *': { borderBottom: 'unset' } }}
                                                key={stat.month}
                                            >
                                                <StyledTableCell sx={{ backgroundColor }}>{monthName}</StyledTableCell>
                                                <StyledTableCell sx={{ backgroundColor }}>{stat.pairs}</StyledTableCell>
                                                <StyledTableCell sx={{ backgroundColor }}>
                                                    {stat.pairs * 2}
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

const AudiencerMonther = (props: {
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

    // TODO: move to external feature (`useAudiencerSchedule`)
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
            .reduce(
                (acc, audience) => {
                    const { name, items } = audience;
                    acc.push(...items.map((e) => ({ ...e, audienceName: name })));
                    return acc;
                },
                [] as (AudienceLesson & { audienceName: string })[],
            )
            .sort((a, b) => (dayjs(a.startAt).isAfter(b.startAt) ? 1 : -1));
    }, [accumulatives, filters, filterDateTime, selectedAudiences, lessonTypes]);

    const statist = React.useMemo(() => {
        const aud: Record<
            string,
            {
                month: number;
                pairs: number;
                // hours: number;
            }[]
        > = {};

        for (const lesson of schedule) {
            if (!aud[lesson.audienceName]) {
                aud[lesson.audienceName] = [];
            }
            const curMonth = dayjs(lesson.startAt).month();
            let statIdx = aud[lesson.audienceName].findIndex((e) => e.month === curMonth);
            if (statIdx === -1) {
                statIdx =
                    aud[lesson.audienceName].push({
                        month: curMonth,
                        pairs: 0,
                        // hours: 0,
                    }) - 1;
            }

            aud[lesson.audienceName][statIdx].pairs++;
        }

        const arr = Object.entries(aud).map(([name, stats]) => ({ name, stats }));

        return arr;
    }, [schedule]);

    if (accumulatives.length === 0) {
        return (
            <Container sx={{ width: '100%' }}>
                <Typography>Loading accumulatives...</Typography>
                <LinearProgress color="secondary" />
            </Container>
        );
    }

    return (
        <>
            <Typography component="pre" align="center" sx={{ pb: 2 }}>
                Displayed: [audience: {statist.length};]
            </Typography>
            <Container component="main" sx={{ mb: 2 }}>
                <TableContainer component={Paper} /* sx={{ maxHeight: 'calc(100vh - 45px)' }} */>
                    <Table stickyHeader size="small">
                        <TableHead>
                            <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                                <StyledTableCell />
                                <StyledTableCell>Аудитоия</StyledTableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {statist.map((row) => (
                                <RowAccumulative key={row.name} row={row} isColoring={props.isColoring} />
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
        </>
    );
};

export default AudiencerMonther;
