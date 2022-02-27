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

export const apiCheckAppVersion = () => {
    try {
        if (resAttempts >= 3) {
            checkNewDomain();
        }

        const lastChecked = store2.get('lastChecked', 0);
        if (Date.now() - lastChecked < 180e3) {
            return Promise.resolve(0);
        }

        return new Promise((resolve, reject) =>
            fetch(`//${window.location.host}/version.json?t=${Date.now()}`, {
                method: 'get',
                headers: {
                    'Cache-Control': 'no-cache, no-store, must-revalidate',
                },
            })
                .then((response) => response.json())
                .then((data) => {
                    const appVersion = store2.get('appVersion');
                    console.log('[VersionChecker] Current:', appVersion, 'New:', data.v);

                    if (data.v && data.v !== appVersion) {
                        store2.set('appVersion', data.v);
                        setTimeout(() => {
                            window.location.reload();
                        }, 1e3);
                    }
                    resolve('reload');
                })
                .catch((err) => {
                    reject(err);
                })
                .finally(() => {
                    store2.set('lastChecked', Date.now());
                })
        );
    } catch (t) {
        return t;
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
