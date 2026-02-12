import React from 'react';
import { useIntl } from 'react-intl';
// @ts-ignore
import PWAPrompt from 'react-ios-pwa-prompt';

import AndroidIcon from '@mui/icons-material/Android';
import AppleIcon from '@mui/icons-material/Apple';
import LeftIcon from '@mui/icons-material/TurnLeft';

import { isAndroid, isIOS } from '../../utils/device.utils';
import { getDescriptionByOS } from '../../utils/pwa.utils';
import appVersion from '../../utils/app-version';

import styles from './pwa.module.scss';

const userOS = isAndroid() ? 'android' : isIOS() ? 'ios' : 'android';

const PWAInstructionComponent = () => {
    const [deferredPrompt, setAndroidDeferredPrompt] = React.useState<BeforeInstallPromptEvent>();
    const [installing, setInstalling] = React.useState(false);
    const { formatMessage } = useIntl();

    const infoByOS = getDescriptionByOS(userOS);
    const onInstallPrompt = React.useCallback(
        (e: Event) => {
            e.preventDefault();
            setAndroidDeferredPrompt(e as BeforeInstallPromptEvent);
        },
        [setAndroidDeferredPrompt],
    );

    React.useEffect(() => {
        window.addEventListener('beforeinstallprompt', onInstallPrompt);
        return () => {
            window.removeEventListener('beforeinstallprompt', onInstallPrompt);
        };
    });

    const onClickCallback = React.useCallback(() => {
        window.location.href = `https://${process.env.REACT_APP_MAIN_HOST}`;
    }, []);

    const handleOnClickInstall = React.useCallback(() => {
        const install = async () => {
            deferredPrompt!.prompt();
            const choiceResult = await deferredPrompt!.userChoice;
            return choiceResult.outcome;
        };

        install().then((e) => {
            console.log('choiceResult:', e);
            if (e === 'accepted') {
                setInstalling(true);
            }
        });
    }, [deferredPrompt, setInstalling]);

    return (
        <div className={styles.Container}>
            <div className={styles.Caption}>
                <div className={styles.CaptionText}>
                    {userOS === 'ios' ? <AppleIcon /> : <AndroidIcon />}
                    {formatMessage({ id: 'pwa.h1' }, { device: userOS, version: appVersion.v })}
                </div>
                <button type="button" className={styles.btnLeft} onClick={onClickCallback}>
                    <LeftIcon />
                    {formatMessage({ id: 'pwa.back' })}
                </button>
            </div>

            {infoByOS.map((info) => (
                <div className={styles.Item} key={info.id}>
                    <div className={styles.ItemHead}>
                        <div className={styles.Number}>{info.id}</div>
                        {formatMessage({ id: info.caption })}
                        {info.captionIcon && React.createElement(info.captionIcon, { className: styles.CaptionIcon })}
                    </div>
                    <div className={styles.ItemBottom}>
                        {info.id === 1
                            ? formatMessage({ id: info.text }, { browser: userOS === 'android' ? 'Chrome' : 'Safari' })
                            : formatMessage({ id: info.text })}
                    </div>
                </div>
            ))}

            {userOS === 'android' && <div className={styles.Alert}>{formatMessage({ id: 'pwa.android.alert' })}</div>}
            {userOS === 'ios' && (
                <PWAPrompt
                    promptOnVisit={1}
                    timesToShow={8e8}
                    copyBody={formatMessage({ id: 'pwa.openBrowser' }, { browser: 'Safari' })}
                    copyShareButtonLabel={formatMessage({ id: 'pwa.ios.step2.desc' })}
                    copyAddHomeButtonLabel={formatMessage({ id: 'pwa.ios.step3.desc' })}
                    copyClosePrompt={formatMessage({ id: 'pwa.back' })}
                    permanentlyHideOnDismiss={false}
                />
            )}
            {userOS === 'android' && deferredPrompt && (
                <button type="button" onClick={handleOnClickInstall} disabled={installing} className={styles.Install}>
                    {formatMessage({ id: 'pwa.install' })}
                </button>
            )}
        </div>
    );
};

export default React.memo(PWAInstructionComponent);
