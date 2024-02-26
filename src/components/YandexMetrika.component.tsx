import * as React from 'react';
import { YMInitializer } from '@appigram/react-yandex-metrika';

export const YandexMetrika = () => {
    const YM_ID = Number(process.env.REACT_APP_YM_ID);

    const [utmFixed, setUtmFixed] = React.useState(false);

    const removeUTMs = React.useCallback(() => {
        if (utmFixed || !window.URLSearchParams || !window.history) {
            return;
        }

        const params = new URLSearchParams(window.location.search);
        let urlShouldBeCleaned = false;
        for (const paramKey of [...params.keys()]) {
            if (paramKey.startsWith('utm_')) {
                params.delete(paramKey);
                urlShouldBeCleaned = true;
            }
        }

        if (urlShouldBeCleaned) {
            const query = params.size > 0 ? '?' + params.toString() : '';
            const cleanUrl = window.location.pathname + query + window.location.hash;
            window.history.replaceState(null, '', cleanUrl);
        }
        setUtmFixed(true);
    }, [utmFixed]);

    React.useEffect(() => {
        let timeout: NodeJS.Timeout | null = null;
        const handleReinit = () => {
            removeUTMs();
        };

        const eventType = `yacounter${YM_ID}inited`;

        window.addEventListener(eventType, handleReinit);
        timeout = setTimeout(handleReinit, 3e3);

        return () => {
            window.removeEventListener(eventType, handleReinit);
            timeout && clearTimeout(timeout);
        };
    }, []);

    if (!YM_ID) return null;

    return (
        <>
            <YMInitializer
                accounts={[YM_ID]}
                options={{
                    clickmap: true,
                    trackLinks: true,
                    accurateTrackBounce: true,
                    webvisor: true,
                    trackHash: true,
                }}
                version="2"
            />
            <noscript>
                <div>
                    <img
                        src={`https://mc.yandex.ru/watch/${YM_ID}`}
                        style={{ position: 'absolute', left: '-9999px' }}
                        alt=""
                    />
                </div>
            </noscript>
        </>
    );
};
