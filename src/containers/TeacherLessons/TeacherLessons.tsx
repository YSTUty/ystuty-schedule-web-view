import React from 'react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import FormControl from '@mui/material/FormControl';
import AppBar from '@mui/material/AppBar';
import Divider from '@mui/material/Divider';

import { ThemeModeButton } from '../../components/ThemeMode.component';
import NavLinkComponent from '../../components/NavLink.component';
import { SelectTeacherComponent } from '../../components/SelectTeacher.component';
import { useTeacherScheduleLoader } from '../TeacherScheduleView/teacherScheduleLoader.util';
import TeacherLessonsTable from './TeacherLessonsTable';

const TeacherLessons = () => {
    useTeacherScheduleLoader();
    const allowMultipleTeachersRef = React.useRef<(state?: any) => void>(() => {});

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
                        Teacher Lessons
                    </Typography>
                    <Typography sx={{ flex: 1 }}></Typography>

                    <Divider orientation="vertical" flexItem />
                    <FormControl sx={{ mx: 1 }}>
                        <NavLinkComponent to="/" style={{ color: 'inherit' }}>
                            ← Back
                        </NavLinkComponent>
                    </FormControl>

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
