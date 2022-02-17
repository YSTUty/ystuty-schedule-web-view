import React from 'react';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import { blue as primary } from '@mui/material/colors';

import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

export const ThemeModeContext = React.createContext({ toggleColorMode: () => {} });

export const ThemeModeButton = () => {
    const theme = useTheme();
    const colorMode = React.useContext(ThemeModeContext);
    return (
        <Box
            sx={{
                display: 'flex',
                // width: '100%',
                alignItems: 'center',
                justifyContent: 'center',
                // bgcolor: 'background.default',
                color: 'text.primary',
                // borderRadius: 1,
                // p: 3,
            }}
        >
            <IconButton onClick={colorMode.toggleColorMode} color="inherit">
                {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
        </Box>
    );
};

export const ThemeModeProvider = (props: { children: any }) => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [mode, setMode] = React.useState<'light' | 'dark'>('light');
    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
        }),
        []
    );

    React.useEffect(() => {
        setMode(prefersDarkMode ? 'dark' : 'light');
    }, [prefersDarkMode]);

    const theme = React.useMemo(() => createTheme({ palette: { mode, primary } }), [mode]);

    return (
        <ThemeModeContext.Provider value={colorMode}>
            <ThemeProvider theme={theme}>
                <CssBaseline />

                {props.children}
            </ThemeProvider>
        </ThemeModeContext.Provider>
    );
};
