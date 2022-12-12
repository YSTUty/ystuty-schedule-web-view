import React from 'react';
import { useIntl } from 'react-intl';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import FormControl from '@mui/material/FormControl';
import AppBar from '@mui/material/AppBar';
import Divider from '@mui/material/Divider';

import HomeIcon from '@mui/icons-material/Home';

import VK, { Like } from '../../components/VK';
import { ThemeModeButton } from '../../components/ThemeMode.component';
import NavLinkComponent from '../../components/NavLink.component';
import { SelectTeacherComponent } from '../../components/SelectTeacher.component';
import { useTeacherScheduleLoader } from '../TeacherScheduleView/teacherScheduleLoader.util';
import TeacherLessonsTable from './TeacherLessonsTable';

import * as envUtils from '../../utils/env.utils';

const TeacherLessons = () => {
    useTeacherScheduleLoader();
    const allowMultipleTeachersRef = React.useRef<(state?: any) => void>(() => {});
    const { formatMessage } = useIntl();

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
                        Teacher Lessons
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
                        <Box sx={{ mt: 2 }}>
                            <SelectTeacherComponent allowMultipleTeachersRef={allowMultipleTeachersRef} />
                        </Box>
                    </Paper>
                </Container>
                <TeacherLessonsTable />
            </Box>
        </>
    );
};

export default TeacherLessons;
