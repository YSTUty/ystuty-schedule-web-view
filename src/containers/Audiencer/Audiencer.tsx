import React from 'react';
import store2 from 'store2';
import { Route, useLocation } from 'react-router';
import { useIntl } from 'react-intl';

import { styled } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import FormControl from '@mui/material/FormControl';
import AppBar from '@mui/material/AppBar';
import Divider from '@mui/material/Divider';
import ToggleButton from '@mui/material/ToggleButton';
import Grid from '@mui/material/Unstable_Grid2';

import HomeIcon from '@mui/icons-material/Home';
import ColoringIcon from '@mui/icons-material/ColorLensSharp';

import { FiltersProvider, FiltersList } from './Filter.provider';
import useAudienceLoader from './useAudienceLoader';
import AudiencerTable from './AudiencerTable';
import AudiencerCombinedTable from './AudiencerCombinedTable';

import VK, { Like } from '../../components/VK';
import { ThemeModeButton } from '../../components/ThemeMode.component';
import NavLinkComponent from '../../components/NavLink.component';
import { useDatePickerComponent, useTimePickerComponent } from './useDateTimePicker.component';
import { SelectAudiencesComponent } from './SelectAudiences.component';

import * as envUtils from '../../utils/env.utils';

const BETA_CONFIRM_KEY = 'betaConfirm-audience';

const Audiencer = () => {
    useAudienceLoader();
    const location = useLocation();
    const { formatMessage } = useIntl();

    const [DatePickerComponent, [date1, date2]] = useDatePickerComponent();
    const [TimePickerComponent, [time1, time2]] = useTimePickerComponent();
    const [isColoring, setColoring] = React.useState(true);

    const isAudienceCombined = location.pathname.startsWith('/audience/combined');

    React.useEffect(() => {
        const isConfirmed = store2.get(BETA_CONFIRM_KEY, false);
        if (!isConfirmed) {
            const confirm = window.confirm(
                'Раздел находится в Beta версии!\n\nДанные могут быть некорректны...\nПродолжить?',
            );
            store2.set(BETA_CONFIRM_KEY, confirm);
        }
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
                    <Typography variant="h6" color="inherit" noWrap sx={{ mr: 2 }}>
                        Audiencer <small>beta</small>
                    </Typography>
                    {envUtils.vkWidgetsApiId && (
                        <>
                            <Divider orientation="vertical" flexItem />
                            <FormControl sx={{ ml: 2 }}>
                                <VK apiId={envUtils.vkWidgetsApiId} options={{ version: 168, onlyWidgets: true }}>
                                    <Like
                                        elementId="vk_like"
                                        options={{ type: 'mini', height: 24, width: 1000, verb: 0 }}
                                        pageId={'viewer-audiencer'}
                                        onLike={(num) => {}}
                                        onUnlike={(num) => {}}
                                        onShare={(num) => {}}
                                        onUnshare={(num) => {}}
                                    />
                                </VK>
                            </FormControl>
                        </>
                    )}

                    <Divider orientation="vertical" flexItem />
                    <FormControl sx={{ mx: 1 }}>
                        <NavLinkComponent to="/" style={{ color: 'inherit' }} title={formatMessage({ id: 'to_home' })}>
                            <HomeIcon />
                        </NavLinkComponent>
                    </FormControl>
                    <Typography sx={{ flex: 1 }}></Typography>

                    <Divider orientation="vertical" flexItem />
                    <FormControl sx={{ mx: 1 }}>
                        <NavLinkComponent
                            to={isAudienceCombined ? '/audience' : '/audience/combined'}
                            style={{ color: 'inherit' }}
                            title={formatMessage({ id: 'audiencer.display_mode.type' })}
                        >
                            {formatMessage({
                                id: `audiencer.display_mode.${isAudienceCombined ? 'combined' : 'divided'}`,
                            })}
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
                    <Container component="main" /* maxWidth="md" */ sx={{ mb: 2 }}>
                        <Paper sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
                            <Typography component="h1" variant="h6" align="center">
                                Фильтрация
                            </Typography>

                            <Grid container spacing={2} sx={{ mt: 1 }}>
                                <Grid xs={12}>
                                    <Paper elevation={3} sx={{ p: 1 }}>
                                        <Grid container spacing={2}>
                                            <Grid xs={12} spacing={3}>
                                                {isAudienceCombined && <SelectAudiencesComponent withDebounce />}
                                            </Grid>
                                            <Grid xs={12} spacing={3}>
                                                <Stack spacing={2}>
                                                    <FiltersList except={isAudienceCombined ? ['audience'] : []} />
                                                </Stack>
                                            </Grid>
                                        </Grid>
                                    </Paper>
                                </Grid>

                                <Grid xs={12} md={8}>
                                    <Grid container spacing={2}>
                                        <Grid xs={12} spacing={3}>
                                            <Paper elevation={3} sx={{ p: 1 }}>
                                                <Stack spacing={3} direction="row">
                                                    <DatePickerComponent />
                                                </Stack>
                                            </Paper>
                                        </Grid>
                                        <Grid xs={12} spacing={3}>
                                            <Paper elevation={3} sx={{ p: 1 }}>
                                                <Stack spacing={3} direction="row">
                                                    <TimePickerComponent />
                                                </Stack>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid xs={12} md={4}>
                                    <Grid container spacing={2}>
                                        <Grid xs={12} spacing={3}>
                                            <Stack spacing={2}>
                                                <ToggleButton
                                                    value="check"
                                                    selected={isColoring}
                                                    onChange={() => {
                                                        setColoring((e) => !e);
                                                    }}
                                                >
                                                    <ColoringIcon /> {formatMessage({ id: 'audiencer.coloring' })}
                                                </ToggleButton>
                                            </Stack>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Container>

                    <Route exact path="/audience">
                        <AudiencerTable filterDateTime={{ date1, date2, time1, time2 }} isColoring={isColoring} />
                    </Route>
                    <Route exact path="/audience/combined">
                        <AudiencerCombinedTable
                            filterDateTime={{ date1, date2, time1, time2 }}
                            isColoring={isColoring}
                        />
                    </Route>
                </Box>
            </FiltersProvider>
        </>
    );
};

export default Audiencer;
