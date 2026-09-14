import React from 'react';
import { useIntl } from 'react-intl';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Paper from '@mui/material/Paper';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';

import NavLinkComponent from '@components/NavLink.component';
import { SelectTeacherComponent } from '@components/SelectTeacher.component';
import { ThemeModeButton } from '@components/ThemeMode.component';
import VK, { Like } from '@components/VK';
import * as envUtils from '@/utils/env.utils';
import { useScheduleLoader } from '@/pages/ScheduleView/scheduleLoader.hook';
import { useSelector } from '@/store';
import {
  getAvailableAcademicPeriods,
  getDefaultAcademicPeriodId,
} from '@/utils/academic-period.utils';
import TeacherLessonsTable from './TeacherLessonsTable';

const TeacherLessons = () => {
  useScheduleLoader({ scheduleFor: 'teacher' });
  const allowMultipleTeachersRef = React.useRef<(state?: any) => void>(
    () => {},
  );
  const { formatMessage } = useIntl();
  const teacherScheduleData = useSelector(
    (state) => state.schedule.scheduleData.teacher,
  );
  const [selectedAcademicPeriodId, setSelectedAcademicPeriodId] =
    React.useState<string>();

  const availableAcademicPeriods = React.useMemo(
    () =>
      getAvailableAcademicPeriods(
        teacherScheduleData?.flatMap((schedule) => schedule.data) ?? [],
      ),
    [teacherScheduleData],
  );
  const defaultAcademicPeriodId = React.useMemo(
    () => getDefaultAcademicPeriodId(availableAcademicPeriods),
    [availableAcademicPeriods],
  );
  const academicPeriodId = selectedAcademicPeriodId ?? defaultAcademicPeriodId;

  React.useEffect(() => {
    setSelectedAcademicPeriodId((currentPeriodId) => {
      if (
        currentPeriodId &&
        availableAcademicPeriods.some((period) => period.id === currentPeriodId)
      ) {
        return currentPeriodId;
      }

      return defaultAcademicPeriodId;
    });
  }, [availableAcademicPeriods, defaultAcademicPeriodId]);

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
            {formatMessage({ id: 'schedule.teacher' })}
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
            <ThemeModeButton />
          </FormControl>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ mt: 4, mb: 4 }}>
        <Container component="main" /* maxWidth="md" */ sx={{ mb: 4 }}>
          <Paper sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}>
            <Typography component="h1" variant="h6" align="center">
              Нагрузка преподавателя
            </Typography>
            <Stack
              direction={{ xs: 'column', sm: 'row' }}
              spacing={2}
              sx={{ mt: 2 }}>
              <Box sx={{ flex: 1, minWidth: 0 }}>
                <SelectTeacherComponent
                  allowMultipleRef={allowMultipleTeachersRef}
                />
              </Box>
              {availableAcademicPeriods.length > 0 && (
                <FormControl size="small" sx={{ flex: 1, minWidth: 250 }}>
                  <InputLabel id="teacher-lessons-period-label">
                    Учебный период
                  </InputLabel>
                  <Select
                    labelId="teacher-lessons-period-label"
                    label="Учебный период"
                    value={academicPeriodId ?? ''}
                    onChange={(event) =>
                      setSelectedAcademicPeriodId(event.target.value)
                    }>
                    {availableAcademicPeriods.map((period) => (
                      <MenuItem key={period.id} value={period.id}>
                        {period.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Stack>
          </Paper>
        </Container>
        <TeacherLessonsTable academicPeriodId={academicPeriodId} />
      </Box>
    </>
  );
};

export default TeacherLessons;
