import React from 'react';
import { useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';

import { useMediaQuery, useTheme } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Toolbar from '@mui/material/Toolbar';
import AppBar from '@mui/material/AppBar';

import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import SchoolIcon from '@mui/icons-material/School';
import HomeIcon from '@mui/icons-material/Home';

import VK, { Like } from './VK';
import { ThemeModeButton } from './ThemeMode.component';
import { AlertMeToggler } from './AlertMe.component';
import { SelectGroupComponent } from './SelectGroup.component';
import { SelectTeacherComponent } from './SelectTeacher.component';
import NavLinkComponent from './NavLink.component';

import * as envUtils from '../utils/env.utils';

const TopPanel = () => {
    const { pathname } = useLocation();
    const { formatMessage } = useIntl();
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    const { allowedMultipleGroups, allowedMultipleTeachers } = useSelector((state) => state.schedule);
    const allowMultipleGroupsRef = React.useRef<(state?: any) => void>(() => {});
    const allowMultipleTeachersRef = React.useRef<(state?: any) => void>(() => {});

    const forTeacher = pathname.startsWith('/teacher');

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
                    {!isSmall && (
                        <Typography variant="h6" color="inherit" noWrap sx={{ mr: 2 }}>
                            View
                        </Typography>
                    )}
                    {!isSmall && <Divider orientation="vertical" flexItem />}
                    <FormControl sx={!isSmall ? { mx: 1 } : { m: 0 }}>
                        <NavLinkComponent to="/" style={{ color: 'inherit' }} title={formatMessage({ id: 'to_home' })}>
                            <HomeIcon />
                        </NavLinkComponent>
                    </FormControl>

                    {!isSmall && <Divider orientation="vertical" flexItem />}

                    <FormControl sx={{ m: 1, minWidth: { xs: 120, sm: 230 } }}>
                        {forTeacher ? (
                            <SelectTeacherComponent allowMultipleTeachersRef={allowMultipleTeachersRef} />
                        ) : (
                            <SelectGroupComponent allowMultipleGroupsRef={allowMultipleGroupsRef} />
                        )}
                    </FormControl>

                    {!isSmall && <Divider orientation="vertical" flexItem />}

                    <FormControl sx={{ pl: 1 }}>
                        <IconButton
                            onClick={() =>
                                forTeacher
                                    ? allowMultipleTeachersRef.current(!allowedMultipleTeachers)
                                    : allowMultipleGroupsRef.current(!allowedMultipleGroups)
                            }
                            color="inherit"
                            sx={{
                                transform: (forTeacher ? allowedMultipleTeachers : allowedMultipleGroups)
                                    ? 'rotate(180deg)'
                                    : '',
                                transition: 'transform 150ms ease',
                            }}
                        >
                            <LocalPizzaIcon />
                        </IconButton>
                    </FormControl>

                    <FormControl sx={{ pl: 1 }}>
                        <IconButton
                            component={NavLinkComponent}
                            href={forTeacher ? '/group' : '/teacher'}
                            color="inherit"
                            title={forTeacher ? 'Расписание для группы' : 'Расписание для преподавателя'}
                            sx={{
                                transform: !forTeacher ? 'rotate(180deg)' : '',
                                transition: 'transform 150ms ease',
                            }}
                        >
                            <SchoolIcon />
                        </IconButton>
                        <AlertMeToggler />
                    </FormControl>

                    {!isSmall && envUtils.vkWidgetsApiId && (
                        <>
                            <Divider orientation="vertical" flexItem />
                            <FormControl sx={{ ml: 2 }}>
                                <VK apiId={envUtils.vkWidgetsApiId} options={{ version: 168, onlyWidgets: true }}>
                                    <Like
                                        elementId="vk_like"
                                        options={{ type: 'mini', height: 24, verb: 0 }}
                                        pageId="app"
                                        onLike={(num) => {}}
                                        onUnlike={(num) => {}}
                                        onShare={(num) => {}}
                                        onUnshare={(num) => {}}
                                    />
                                </VK>
                            </FormControl>
                        </>
                    )}

                    <Typography sx={{ flex: 1 }}></Typography>

                    <FormControl sx={{ mx: 1 }}>
                        <ThemeModeButton />
                    </FormControl>
                </Toolbar>
            </AppBar>
        </>
    );
};
export default TopPanel;
