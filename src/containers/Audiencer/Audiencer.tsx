import React from 'react';
import { useIntl } from 'react-intl';
import { Route, Routes, useLocation } from 'react-router-dom';
import store2 from 'store2';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import ToggleButton from '@mui/material/ToggleButton';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Unstable_Grid2';
import ColoringIcon from '@mui/icons-material/ColorLensSharp';
import HomeIcon from '@mui/icons-material/Home';

import LessonTypeSelector from '@components/LessonTypeSelector.component';
import NavLinkComponent from '@components/NavLink.component';
import { ThemeModeButton } from '@components/ThemeMode.component';
import VK, { Like } from '@components/VK';
import * as envUtils from '@/utils/env.utils';
import AudiencerCombinedTable from './AudiencerCombinedTable';
import AudiencerMonther from './AudiencerMonther';
import AudiencerTable from './AudiencerTable';
import { FiltersList, FiltersProvider } from './Filter.provider';
import { SelectAudiencesComponent } from './SelectAudiences.component';
import useAudienceLoader from './useAudienceLoader';
import {
  useDatePickerComponent,
  useTimePickerComponent,
} from './useDateTimePicker.component';

const BETA_CONFIRM_KEY = 'betaConfirm-audience';

const Audiencer = () => {
  useAudienceLoader();
  const location = useLocation();
  const { formatMessage } = useIntl();

  const [DatePickerComponent, [date1, date2]] = useDatePickerComponent();
  const [TimePickerComponent, [time1, time2]] = useTimePickerComponent();
  const [isColoring, setColoring] = React.useState(true);

  const isAudienceCombined = location.pathname.startsWith('/audience/combined');
  const isAudienceMonther = location.pathname.startsWith('/audience/month');

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
        }}>
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap sx={{ mr: 2 }}>
            {formatMessage({ id: 'schedule.audiencer' })} <small>beta</small>
          </Typography>
          {envUtils.vkWidgetsApiId && (
            <>
              <Divider orientation="vertical" flexItem />
              <FormControl sx={{ ml: 2 }}>
                <VK
                  apiId={envUtils.vkWidgetsApiId}
                  options={{ version: 168, onlyWidgets: true }}>
                  <Like
                    elementId="vk_like"
                    options={{ type: 'mini', height: 24, verb: 0 }}
                    pageId="app"
                    onLike={() => {}}
                    onUnlike={() => {}}
                    onShare={() => {}}
                    onUnshare={() => {}}
                  />
                </VK>
              </FormControl>
            </>
          )}

          <Divider orientation="vertical" flexItem />
          <FormControl sx={{ mx: 1 }}>
            <NavLinkComponent
              to="/"
              style={{ color: 'inherit' }}
              title={formatMessage({ id: 'to_home' })}>
              <HomeIcon />
            </NavLinkComponent>
          </FormControl>
          <Typography sx={{ flex: 1 }}></Typography>

          <Divider orientation="vertical" flexItem />
          <FormControl sx={{ mx: 1 }}>
            <NavLinkComponent
              to={
                isAudienceCombined || isAudienceMonther
                  ? '/audience'
                  : '/audience/combined'
              }
              style={{ color: 'inherit' }}
              title={formatMessage({ id: 'audiencer.display_mode.type' })}>
              {formatMessage({
                id: `audiencer.display_mode.${
                  isAudienceCombined
                    ? 'combined'
                    : isAudienceMonther
                      ? 'monther'
                      : 'divided'
                }`,
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
                    <Grid spacing={2}>
                      <Grid xs={12} spacing={3}>
                        <SelectAudiencesComponent withDebounce />
                      </Grid>
                      <Divider
                        orientation="horizontal"
                        textAlign="left"
                        variant="middle"
                        flexItem>
                        Используются оба фильтра в виде списка ↑ и строки ↓
                      </Divider>
                      <Grid xs={12} spacing={3}>
                        <Stack spacing={2}>
                          <FiltersList />
                        </Stack>
                      </Grid>
                      <Grid xs={12} spacing={3}>
                        <LessonTypeSelector isAudiencer />
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
                          }}>
                          <ColoringIcon />{' '}
                          {formatMessage({ id: 'audiencer.coloring' })}
                        </ToggleButton>
                      </Stack>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Paper>
          </Container>

          <Routes>
            <Route
              path="/audience"
              element={
                <AudiencerTable
                  filterDateTime={{ date1, date2, time1, time2 }}
                  isColoring={isColoring}
                />
              }
            />
            <Route
              path="/audience/month"
              element={
                <AudiencerMonther
                  filterDateTime={{ date1, date2, time1, time2 }}
                  isColoring={isColoring}
                />
              }
            />
            <Route
              path="/audience/combined"
              element={
                <AudiencerCombinedTable
                  filterDateTime={{ date1, date2, time1, time2 }}
                  isColoring={isColoring}
                />
              }
            />
          </Routes>
        </Box>
      </FiltersProvider>
    </>
  );
};

export default Audiencer;
