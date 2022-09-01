import React from 'react';
import store2 from 'store2';
import { ThemeProvider, createTheme, useTheme } from '@mui/material/styles';
import { blue as primary } from '@mui/material/colors';

import IconButton from '@mui/material/IconButton';
import CssBaseline from '@mui/material/CssBaseline';
import useMediaQuery from '@mui/material/useMediaQuery';

import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

const STORE_THEME_MODE_KEY = 'themeMode';
const LAST_THEME_MODE = store2.get(STORE_THEME_MODE_KEY, null) as 'light' | 'dark' | null;

export const ThemeModeContext = React.createContext({ toggleColorMode: () => {} });

export const ThemeModeButton = () => {
    const theme = useTheme();
    const colorMode = React.useContext(ThemeModeContext);
    return (
        <IconButton onClick={colorMode.toggleColorMode} color="inherit">
            {theme.palette.mode === 'dark' ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
    );
};

export const ThemeModeProvider = (props: { children: any }) => {
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [mode, setMode] = React.useState<'light' | 'dark'>(LAST_THEME_MODE || 'light');
    const colorMode = React.useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => {
                    const newMode = prevMode === 'light' ? 'dark' : 'light';
                    store2.set(STORE_THEME_MODE_KEY, newMode);
                    if (prefersDarkMode && prevMode !== 'dark') {
                        store2.remove(STORE_THEME_MODE_KEY);
                    }
                    return newMode;
                });
            },
        }),
        [prefersDarkMode]
    );

    React.useEffect(() => {
        !LAST_THEME_MODE && setMode(prefersDarkMode ? 'dark' : 'light');
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
