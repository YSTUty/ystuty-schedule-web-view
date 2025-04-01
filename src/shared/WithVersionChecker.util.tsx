import React from 'react';
import store2 from 'store2';

let resAttempts = 1;

const checkNewDomain = () =>
    fetch('https://ystuty.web.app/dom-view.json', { method: 'POST' })
        .then((response) => response.json())
        .then((data) => {
            if (data.origin !== window.location.host) {
                window.location.replace(`https://${data.origin}`);
            }
        })
        .catch();

export const apiCheckAppVersion = async () => {
    const CHECK_INTERVAL_MS = 3 * 60e3;
    const RELOAD_DELAY_MS = 1e3;
    const MAX_ATTEMPTS = 3;

    try {
        let resAttempts = store2.get('resAttempts', 0);

        if (resAttempts >= MAX_ATTEMPTS) {
            checkNewDomain();
            // Max attempts reached
            return null;
        }

        const lastChecked = store2.get('lastChecked', 0);
        if (Date.now() - lastChecked < CHECK_INTERVAL_MS) {
            return null;
        }

        const response = await fetch(`//${window.location.host}/version.json?t=${Date.now()}`, {
            method: 'GET',
            headers: {
                'Cache-Control': 'no-cache, no-store, must-revalidate',
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        const data = await response.json();
        const appVersion = store2.get('appVersion');

        console.log('[VersionChecker] Current:', appVersion, 'New:', data.v);

        if (data.v && data.v !== appVersion) {
            store2.set('appVersion', data.v);
            setTimeout(() => window.location.reload(), RELOAD_DELAY_MS);
            return true;
        }

        // no update
        return null;
    } catch (err) {
        // console.error('[VersionChecker] Error:', err);

        store2.set('resAttempts', (store2.get('resAttempts', 0) || 0) + 1);
        store2.set('lastChecked', Date.now());

        // throw err;
        return err;
    } finally {
        store2.set('lastChecked', Date.now());
    }
};

const WithVersionCheckerConnect = (BaseComponent: any) =>
    class extends React.Component {
        private versionInterval: any = null;

        handleVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                apiCheckAppVersion();
            }
        };

        componentDidMount() {
            document.addEventListener('visibilitychange', this.handleVisibilityChange);
            setTimeout(() => apiCheckAppVersion(), 1200);
        }

        componentWillUnmount() {
            document.removeEventListener('visibilitychange', this.handleVisibilityChange);
            if (this.versionInterval) {
                clearInterval(this.versionInterval);
            }
        }

        render() {
            return <BaseComponent {...this.props} />;
        }

        static get displayName() {
            return `WithVersionChecker(${BaseComponent.displayName || BaseComponent.name})`;
        }
    };
export default WithVersionCheckerConnect;
