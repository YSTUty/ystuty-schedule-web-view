import * as React from 'react';
import { useSelector } from 'react-redux';
import { Buffer } from 'buffer';

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
import SvgIcon from '@mui/material/SvgIcon';

import ImportExportIcon from '@mui/icons-material/ImportExportSharp';
import SchoolIcon from '@mui/icons-material/School';
import AudienceIcon from '@mui/icons-material/DoorSliding';
import TelegramIcon from '@mui/icons-material/Telegram';
import SupportAgentIcon from '@mui/icons-material/SupportAgentSharp';
import { ReactComponent as VkSvg } from '../../assets/img/vk-logo.svg';

import VK, { Like } from '../../components/VK';
import { ThemeModeButton } from '../../components/ThemeMode.component';
import NavLinkComponent from '../../components/NavLink.component';
import * as envUtils from '../../utils/env.utils';

const MainPage = () => {
    const selectedGroups = useSelector((state) => state.schedule.selectedItems.group) as string[];

    const groupNameConv = React.useMemo(
        () =>
            ((e) => (e ? Buffer.from(/* encodeURIComponent */ e).toString('base64').replace(/=/g, '') : null))(
                selectedGroups[0],
            ),
        [selectedGroups],
    );

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
                        [YSTUty] Расписание
                    </Typography>
                    {envUtils.vkWidgetsApiId && (
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

            <Container component="main" maxWidth="md" sx={{ mb: 0 }}>
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
                        <ButtonGroup size="large" orientation="vertical">
                            <Button
                                to={'/group'}
                                component={NavLinkComponent}
                                color="secondary"
                                variant="contained"
                                endIcon={<SchoolIcon />}
                                title="Расписание по группам"
                            >
                                Для студентов
                            </Button>
                            <Button to={'/teacher'} component={NavLinkComponent} title="Расписание по преподавателям">
                                Для преподавателей 👨🏼‍🏫👩🏼‍🏫
                            </Button>
                            <Button
                                to={'/by_audience'}
                                component={NavLinkComponent}
                                endIcon={<AudienceIcon />}
                                title="Расписание по аудиториям"
                                size="medium"
                            >
                                Аудитории
                            </Button>
                        </ButtonGroup>
                    </Box>

                    {(envUtils.telegramBotName || envUtils.vkBotGroupName) && (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                mt: 2,
                                '& > *': { m: 1 },
                            }}
                        >
                            <Typography component="h6" variant="body2" align="center">
                                Добавь бота в свою беседу
                            </Typography>
                            <ButtonGroup size="large" orientation="vertical">
                                {envUtils.telegramBotName && (
                                    <Button
                                        href={`https://t.me/${envUtils.telegramBotName}${
                                            groupNameConv ? `?start=g_${groupNameConv}` : ''
                                        }`}
                                        target="_blank"
                                        component={Link}
                                        color="primary"
                                        variant="contained"
                                        endIcon={<TelegramIcon />}
                                        title="Бот расписания в Telegram"
                                    >
                                        Telegram бот расписания
                                    </Button>
                                )}
                                {envUtils.vkBotGroupName && (
                                    <Button
                                        href={`https://vk.me/${envUtils.vkBotGroupName}${
                                            groupNameConv ? `?ref=g_${groupNameConv}` : ''
                                        }`}
                                        target="_blank"
                                        component={Link}
                                        color="primary"
                                        variant="outlined"
                                        endIcon={<SvgIcon component={VkSvg} inheritViewBox />}
                                        title="Бот расписания в VK"
                                    >
                                        VK бот расписания
                                    </Button>
                                )}
                            </ButtonGroup>
                        </Box>
                    )}

                    {envUtils.linkToSupport && (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                mt: 2,
                                '& > *': { m: 1 },
                            }}
                        >
                            <Button
                                href={envUtils.linkToSupport}
                                target="_blank"
                                component={Link}
                                color="warning"
                                variant="outlined"
                                endIcon={<SupportAgentIcon />}
                                title="Поддержка/Задать вопрос/Что-нибудь предложить"
                            >
                                Поддержка
                            </Button>
                        </Box>
                    )}

                    <Typography sx={{ mt: 2, fontSize: 11 }}>
                        <NavLinkComponent to="/teacher-lessons" style={{ color: 'grey' }}>
                            Список предметов по преподавателям
                        </NavLinkComponent>
                        {/* <br />
                        <NavLinkComponent to="/audience/month" style={{ color: 'grey' }}>
                            Статистика аудиторий по месяцам
                        </NavLinkComponent> */}
                    </Typography>
                </Paper>
            </Container>
        </>
    );
};

export default MainPage;
