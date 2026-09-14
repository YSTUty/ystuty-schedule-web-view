import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import HomeIcon from '@mui/icons-material/Home';

import Copyright from '@components/Copyright.component';
import NavLinkComponent from '@components/NavLink.component';

/** Показывается для неизвестных маршрутов вместо технического текста `not found`. */
const NotFoundPage = () => (
  <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100dvh' }}>
    <AppBar
      color="default"
      elevation={5}
      position="static"
      sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}>
      <Toolbar>
        <Typography
          variant="h6"
          color="inherit"
          noWrap
          sx={{ fontSize: { xs: '1rem', sm: '1.25rem' }, mr: 'auto' }}>
          <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
            [YSTUty]{' '}
          </Box>
          Расписание
        </Typography>
        <IconButton
          component={NavLinkComponent}
          title="На главную"
          to="/"
          color="inherit">
          <HomeIcon />
        </IconButton>
      </Toolbar>
    </AppBar>

    <Box
      component="main"
      sx={{
        alignItems: 'center',
        display: 'flex',
        flex: 1,
        justifyContent: 'center',
        p: 3,
      }}>
      <Paper
        elevation={4}
        sx={{
          maxWidth: 520,
          p: { xs: 3, sm: 4 },
          textAlign: 'center',
          width: '100%',
        }}>
        <Stack spacing={3}>
          <Typography
            aria-hidden
            color="primary"
            sx={{
              fontSize: { xs: '4rem', sm: '5rem' },
              fontWeight: 700,
              lineHeight: 1,
            }}>
            404
          </Typography>
          <Box>
            <Typography component="h1" variant="h5" gutterBottom>
              Страница не найдена
            </Typography>
            <Typography color="text.secondary">
              Возможно, ссылка устарела или была введена с ошибкой. Вернитесь на
              главную страницу и выберите нужное расписание.
            </Typography>
          </Box>
          <Box>
            <Button
              component={NavLinkComponent}
              startIcon={<HomeIcon />}
              to="/"
              variant="contained">
              Вернуться к расписанию
            </Button>
          </Box>
        </Stack>
      </Paper>
    </Box>

    <Box component="footer" sx={{ px: 2 }}>
      <Copyright />
    </Box>
  </Box>
);

export default NotFoundPage;
