import React from 'react';
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
import NavLinkComponent from './NavLink.component';
import { SelectGroupComponent } from './SelectGroup.component';
import { SelectTeacherComponent } from './SelectTeacher.component';
import { SelectAudienceComponent } from './SelectAudience.component';

import * as envUtils from '../utils/env.utils';
import { ScheduleFor } from '../interfaces/ystuty.types';

export type TopPanelProps = {
    scheduleFor: ScheduleFor;
};

const TopPanel: React.FC<TopPanelProps> = (props) => {
    const { scheduleFor } = props;

    const { formatMessage } = useIntl();
    const theme = useTheme();
    const isSmall = useMediaQuery(theme.breakpoints.down('sm'));

    const allowedMultiple = useSelector((state) => state.schedule.allowedMultiple);

    const allowMultipleRef = React.useRef<(state?: any) => void>(() => {});

    const onChangeMultiple = React.useCallback(() => {
        allowMultipleRef.current(!allowedMultiple[scheduleFor]);
    }, [allowedMultiple, scheduleFor, allowMultipleRef]);

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
                            {formatMessage({ id: 'schedule.viewer' })}
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
                        {scheduleFor === 'group' ? (
                            <SelectGroupComponent allowMultipleRef={allowMultipleRef} />
                        ) : scheduleFor === 'teacher' ? (
                            <SelectTeacherComponent allowMultipleRef={allowMultipleRef} />
                        ) : (
                            <SelectAudienceComponent allowMultipleRef={allowMultipleRef} />
                        )}
                    </FormControl>

                    {!isSmall && <Divider orientation="vertical" flexItem />}
                    <FormControl sx={{ pl: 1 }}>
                        <IconButton
                            onClick={onChangeMultiple}
                            title={`Разрешить выбор нескольких ${
                                scheduleFor === 'group'
                                    ? 'групп'
                                    : scheduleFor === 'teacher'
                                    ? 'преподавателей'
                                    : 'аудиторий'
                            }`}
                            color="inherit"
                            sx={{
                                transform: allowedMultiple[scheduleFor] ? 'rotate(180deg)' : '',
                                transition: 'transform 150ms ease',
                            }}
                        >
                            <LocalPizzaIcon />
                        </IconButton>
                    </FormControl>

                    <FormControl sx={{ pl: 1 }}>
                        {/* // * Switch between groups and teachers */}
                        <IconButton
                            component={NavLinkComponent}
                            href={scheduleFor === 'teacher' ? '/group' : '/teacher'}
                            color="inherit"
                            title={scheduleFor === 'teacher' ? 'Расписание для группы' : 'Расписание для преподавателя'}
                            sx={{
                                transform: scheduleFor !== 'teacher' ? 'rotate(180deg)' : '',
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
