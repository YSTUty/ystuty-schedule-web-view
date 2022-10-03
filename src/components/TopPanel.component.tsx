import React from 'react';
import { useLocation } from 'react-router';
import { useSelector } from 'react-redux';

import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';

import LocalPizzaIcon from '@mui/icons-material/LocalPizza';
import TelegramIcon from '@mui/icons-material/Telegram';
import SchoolIcon from '@mui/icons-material/School';

import { ThemeModeButton } from './ThemeMode.component';
import VersionComponent from './Version.component';
import { AlertMeToggler } from './AlertMe.component';
import { SelectGroupComponent } from './SelectGroup.component';
import { SelectTeacherComponent } from './SelectTeacher.component';
import NavLinkComponent from './NavLink.component';

import * as appConstants from '../constants/app.constants';

const TopPanel = ( ) => {
    const { pathname } = useLocation();
    const { allowedMultipleGroups, allowedMultipleTeachers } = useSelector((state) => state.schedule);
    const allowMultipleGroupsRef = React.useRef<(state?: any) => void>(() => {});
    const allowMultipleTeachersRef = React.useRef<(state?: any) => void>(() => {});

    const forTeacher = pathname.startsWith('/teacher');

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'text.primary',
            }}
        >
            <FormControl sx={{ m: 1, minWidth: { xs: 120, sm: 230 } }}>
                {forTeacher ? (
                    <SelectTeacherComponent allowMultipleTeachersRef={allowMultipleTeachersRef} />
                ) : (
                    <SelectGroupComponent allowMultipleGroupsRef={allowMultipleGroupsRef} />
                )}
            </FormControl>

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
                <ThemeModeButton />
            </FormControl>

            <FormControl sx={{ pl: 1 }}>
                {appConstants.telegramBotName && (
                    <IconButton
                        href={`https://${appConstants.telegramBotName}.t.me?start=viewer`}
                        target="_blank"
                        color="inherit"
                    >
                        <TelegramIcon />
                    </IconButton>
                )}
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
            <FormControl sx={{ pl: 1 }}>
                <VersionComponent />
            </FormControl>
        </Box>
    );
};
export default TopPanel;
