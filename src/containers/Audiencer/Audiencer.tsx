import React from 'react';
import { useDebounce } from 'react-use';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import FormControl from '@mui/material/FormControl';
import AppBar from '@mui/material/AppBar';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';

import useAudienceLoader from './useAudienceLoader';
import AudiencerTable from './AudiencerTable';
import { ThemeModeButton } from '../../components/ThemeMode.component';
import { useDatePickerComponent, useTimePickerComponent } from './useDateTimePicker.component';

const FilterComponent = (props: { label: string; placeholder: string; setFilterValue: Function }) => {
    const { label, placeholder, setFilterValue } = props;
    const [val, setVal] = React.useState('');

    useDebounce(() => setFilterValue(val), 1200, [val]);

    return (
        <TextField
            size="small"
            label={label}
            placeholder={placeholder}
            value={val}
            onChange={({ currentTarget }) => {
                setVal(currentTarget.value);
            }}
            variant="outlined"
            hiddenLabel
            margin="dense"
        />
    );
};

// TODO: fix glitched
const useFilterComponent = () => {
    const [filterValue, setFilterValue] = React.useState('');
    // const filterValue = React.useRef('');
    const [val, setVal] = React.useState('');

    useDebounce(() => setFilterValue(val), 1200, [val]);
    // useDebounce(() => (filterValue.current = val), 1200, [val]);

    const component = (props: { label: string; placeholder: string }) => {
        const { label, placeholder } = props;
        return (
            <TextField
                size="small"
                label={label}
                placeholder={placeholder}
                value={val}
                onChange={({ currentTarget }) => {
                    setVal(currentTarget.value);
                }}
                variant="outlined"
                hiddenLabel
                margin="dense"
            />
        );
    };

    return [component, filterValue] as const;
};

const Audiencer = () => {
    useAudienceLoader();

    // const [audienceFilterComponent, filterAudience] = useFilterComponent();
    // const [LessonFilterComponent, filterLesson] = useFilterComponent();

    const [filterAudience, setFilterAudience] = React.useState('');
    const [filterLesson, setFilterLesson] = React.useState('');

    const [DatePickerComponent, [date1, date2]] = useDatePickerComponent();
    const [TimePickerComponent, [time1, time2]] = useTimePickerComponent();

    React.useEffect(() => {
        console.log('EFF Audiencer');
    }, []);

    return (
        <>
            <AppBar
                position="absolute"
                color="default"
                elevation={5}
                sx={{
                    position: 'relative',
                    borderBottom: (t) => `1px solid ${t.palette.divider}`,
                }}
            >
                <Toolbar>
                    <Typography variant="h6" color="inherit" noWrap>
                        Audiencer <small>beta</small>
                    </Typography>
                    <Typography sx={{ flex: 1 }}></Typography>
                    <Divider orientation="vertical" flexItem />
                    <FormControl sx={{ ml: 2 }}>
                        <ThemeModeButton />
                    </FormControl>
                </Toolbar>
            </AppBar>

            <Box component="main" sx={{ mt: 4, mb: 4 }}>
                <Container component="main" /* maxWidth="md" */ sx={{ mb: 4 }}>
                    <Paper sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                        <Typography component="h1" variant="h6" align="center">
                            Фильтрация
                        </Typography>

                        <Stack spacing={2}>
                            <FilterComponent
                                label="Аудитории"
                                placeholder="Г-501,г-62,А-31"
                                setFilterValue={setFilterAudience}
                            />
                            <FilterComponent
                                label="Предметы, группы"
                                placeholder="эис-46,овр-"
                                setFilterValue={setFilterLesson}
                            />
                            {/* <AudienceFilterComponent label="Аудитории" placeholder="Г-501,г-62,А-31" /> */}
                            {/* <LessonFilterComponent label="Предметы, группы" placeholder="эис-46,овр-" /> */}

                            <Stack spacing={3} direction="row">
                                <DatePickerComponent />
                            </Stack>
                            <Stack spacing={3} direction="row">
                                <TimePickerComponent />
                            </Stack>
                        </Stack>
                    </Paper>
                </Container>

                <AudiencerTable filter={{ filterAudience, filterLesson, date1, date2, time1, time2 }} />
            </Box>
        </>
    );
};

export default Audiencer;
