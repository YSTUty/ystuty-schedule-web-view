import IosShareIcon from '@mui/icons-material/IosShare';
import AddToHomeScreenIcon from '@mui/icons-material/AddToHomeScreen';
import MenuIcon from '@mui/icons-material/Menu';

import { history } from '../store/index';
import * as appConstants from '../constants/app.constants';
import * as deviceUtils from './device.utils';

export const getDescriptionByOS = (os: 'ios' | 'android') =>
    ({
        ios: [
            {
                id: 1,
                caption: `pwa.${os}.step1.title`,
                text: 'pwa.openBrowser',
            },
            {
                id: 2,
                caption: `pwa.${os}.step2.title`,
                text: `pwa.${os}.step2.desc`,
                captionIcon: IosShareIcon,
            },
            {
                id: 3,
                caption: `pwa.${os}.step3.title`,
                text: `pwa.${os}.step3.desc`,
                captionIcon: AddToHomeScreenIcon,
            },
        ],
        android: [
            {
                id: 1,
                caption: `pwa.${os}.step1.title`,
                text: 'pwa.openBrowser',
            },
            {
                id: 2,
                caption: `pwa.${os}.step2.title`,
                text: `pwa.${os}.step2.desc`,
                captionIcon: MenuIcon,
            },
            {
                id: 3,
                caption: `pwa.${os}.step3.title`,
                text: `pwa.${os}.step3.desc`,
            },
        ],
    }[os] || []);

export const checkPWA = () => {
    if (window.location.search.includes('?mode=pwa')) {
        try {
            sessionStorage.setItem('PWA_MODE', '1');
        } catch {}
    }

    if (
        window.location.hostname === appConstants.pwaHostname &&
        !deviceUtils.isPWA() &&
        window.location.pathname !== '/pwa'
    ) {
        history.push('/pwa');
        // fix rerendering
        if (deviceUtils.isIOS()) {
            window.location.reload();
        }
    }
};
