import AppBar from '@mui/material/AppBar';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Link from '@mui/material/Link';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';

import GitHubIcon from '@mui/icons-material/GitHub';
import ImportExportIcon from '@mui/icons-material/ImportExportSharp';

import { ThemeModeButton } from '../../components/ThemeMode.component';
import VersionComponent from '../../components/Version.component';
import NavLinkComponent from '../../components/NavLink.component';
import * as envUtils from '../../utils/env.utils';

const Copyright = () => {
    return (
        <Typography component="div" variant="body2" color="text.secondary" align="center" sx={{ pt: 3 }}>
            {'Copyright © '}
            2018-{new Date().getFullYear()}{' '}
            {envUtils.linkYSTUty ? (
                <Link href={envUtils.linkYSTUty} color="inherit">
                    YSTUty
                </Link>
            ) : (
                'YSTUty'
            )}
            {'.'}
            {envUtils.linkToGitHub && (
                <Link href={envUtils.linkToGitHub} target="_blank" color="inherit" sx={{ ml: 1 }}>
                    <GitHubIcon fontSize="small" />
                </Link>
            )}
            <br />
            <VersionComponent />
        </Typography>
    );
};

const App = () => {
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
                        [YSTUty] <b>View</b>er
                    </Typography>
                    <Typography sx={{ flex: 1 }}></Typography>
                    <Divider orientation="vertical" flexItem />
                    <FormControl>
                        <ThemeModeButton />
                    </FormControl>
                    {envUtils.linkToICS && (
                        <>
                            <Divider orientation="vertical" flexItem />
                            <FormControl>
                                <Link href={envUtils.linkToICS} color="inherit">
                                    <IconButton>
                                        <ImportExportIcon />
                                    </IconButton>
                                    Calendar
                                </Link>
                            </FormControl>
                        </>
                    )}
                </Toolbar>
            </AppBar>

            <Container component="main" maxWidth="md" sx={{ mb: 4 }}>
                <Paper sx={{ my: { xs: 3 }, p: { xs: 2, md: 3 } }}>
                    <Typography component="h1" variant="h4" align="center">
                        Просмотр расписания в браузере
                    </Typography>
                    <Typography sx={{ mt: 2 }}>
                        На данном сайте есть возможность просмотра расписания по выбранным группам и преподавателям.
                        Есть возможность экспорта расписания в сторонние календари{' '}
                        {envUtils.linkToICS ? (
                            <Link href={envUtils.linkToICS} color="inherit">
                                ICS
                            </Link>
                        ) : (
                            'ICS'
                        )}
                        .
                    </Typography>
                </Paper>

                <Paper sx={{ my: 1, p: { xs: 2, md: 3 } }}>
                    <Typography component="h2" variant="h6" align="center">
                        Расписание
                    </Typography>
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            '& > *': { m: 1 },
                        }}
                    >
                        <ButtonGroup size="large">
                            <Button to={'/group'} component={NavLinkComponent}>
                                По группам
                            </Button>
                            <Button to={'/teacher'} component={NavLinkComponent}>
                                По преподавателям
                            </Button>
                            <Button to={'/audience'} component={NavLinkComponent}>
                                По аудиториям
                            </Button>
                        </ButtonGroup>
                    </Box>
                </Paper>
                <Copyright />
            </Container>
        </>
    );
};

export default App;
