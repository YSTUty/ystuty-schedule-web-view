import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

import GitHubIcon from '@mui/icons-material/GitHub';
import TelegramIcon from '@mui/icons-material/Telegram';
import SupportAgentIcon from '@mui/icons-material/SupportAgentSharp';

import VersionComponent from './Version.component';
import * as envUtils from '../utils/env.utils';

const Copyright = () => {
    return (
        <Typography component="div" variant="body2" color="text.secondary" align="center" sx={{ py: 1 }}>
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
            {envUtils.linkToGitHub && envUtils.telegramUsername && ' '}
            {envUtils.telegramUsername && (
                <Link href={`https://t.me/${envUtils.telegramUsername}`} target="_blank" color="inherit" sx={{ ml: 1 }}>
                    <TelegramIcon fontSize="small" />
                </Link>
            )}
            {envUtils.linkToSupport && (
                <Link
                    href={envUtils.linkToSupport}
                    target="_blank"
                    sx={{ ml: 1 }}
                    color="inherit"
                    title="Поддержка/Задать вопрос/Что-нибудь предложить"
                >
                    <SupportAgentIcon />
                </Link>
            )}
            <br />
            <VersionComponent />
        </Typography>
    );
};
export default Copyright;
