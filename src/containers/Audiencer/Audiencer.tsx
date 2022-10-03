import { Route, useLocation } from 'react-router';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import FormControl from '@mui/material/FormControl';
import AppBar from '@mui/material/AppBar';
import Divider from '@mui/material/Divider';

import { FiltersProvider, FiltersList } from './Filter.provider';
import useAudienceLoader from './useAudienceLoader';
import AudiencerTable from './AudiencerTable';
import AudiencerCombinedTable from './AudiencerCombinedTable';
import { useDatePickerComponent, useTimePickerComponent } from './useDateTimePicker.component';
import { SelectAudiencesComponent } from './SelectAudiences.component';
import { ThemeModeButton } from '../../components/ThemeMode.component';
import NavLinkComponent from '../../components/NavLink.component';

const Audiencer = () => {
    useAudienceLoader();
    const location = useLocation();

    const [DatePickerComponent, [date1, date2]] = useDatePickerComponent();
    const [TimePickerComponent, [time1, time2]] = useTimePickerComponent();

    const isAudienceCombined = location.pathname.startsWith('/audience/combined');

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
                    <FormControl sx={{ mx: 1 }}>
                        <NavLinkComponent
                            to={isAudienceCombined ? '/audience' : '/audience/combined'}
                            style={{ color: 'inherit' }}
                        >
                            {isAudienceCombined ? 'Combined' : 'Divided'}
                        </NavLinkComponent>
                    </FormControl>

                    <Divider orientation="vertical" flexItem />
                    <FormControl sx={{ mx: 1 }}>
                        <ThemeModeButton />
                    </FormControl>
                </Toolbar>
            </AppBar>

            <FiltersProvider>
                <Box component="main" sx={{ mt: 4, mb: 4 }}>
                    <Container component="main" /* maxWidth="md" */ sx={{ mb: 4 }}>
                        <Paper sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                            <Typography component="h1" variant="h6" align="center">
                                Фильтрация
                            </Typography>

                            <Stack spacing={2}>
                                {isAudienceCombined && <SelectAudiencesComponent withDebounce />}
                                <FiltersList except={isAudienceCombined ? ['audience'] : []} />
                                <Stack spacing={3} direction="row">
                                    <DatePickerComponent />
                                </Stack>
                                <Stack spacing={3} direction="row">
                                    <TimePickerComponent />
                                </Stack>
                            </Stack>
                        </Paper>
                    </Container>

                    <Route exact path="/audience">
                        <AudiencerTable filterDateTime={{ date1, date2, time1, time2 }} />
                    </Route>
                    <Route exact path="/audience/combined">
                        <AudiencerCombinedTable filterDateTime={{ date1, date2, time1, time2 }} />
                    </Route>
                </Box>
            </FiltersProvider>
        </>
    );
};

export default Audiencer;
