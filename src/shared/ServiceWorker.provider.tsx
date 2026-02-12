import React from 'react';
import * as serviceWorker from '../serviceWorkerRegistration';

const ServiceWorkerContext = React.createContext<{
    isUpdateAvailable: boolean;
    updateAssets: () => void;
} | null>(null);

const ServiceWorkerProvider = ({ children }: any) => {
    const [waitingServiceWorker, setWaitingServiceWorker] = React.useState<ServiceWorker | null>(null);
    const [isUpdateAvailable, setUpdateAvailable] = React.useState(false);

    React.useEffect(() => {
        serviceWorker.register({
            onUpdate: (registration) => {
                setWaitingServiceWorker(registration.waiting);
                setUpdateAvailable(true);
            },
            onWaiting: (waiting) => {
                setWaitingServiceWorker(waiting);
                setUpdateAvailable(true);
            },
        });
    }, []);

    React.useEffect(() => {
        // We setup an event listener to automatically reload the page
        // after the Service Worker has been updated, this will trigger
        // on all the open tabs of our application, so that we don't leave
        // any tab in an incosistent state

        waitingServiceWorker?.addEventListener(
            'statechange',
            (
                event: Event & {
                    target: (Partial<ServiceWorker> & EventTarget) | null;
                },
            ) => {
                if (event.target && event.target.state === 'activated') {
                    window.location.reload();
                }
            },
        );
    }, [waitingServiceWorker]);

    const value = React.useMemo(
        () => ({
            isUpdateAvailable,
            updateAssets: () => {
                if (waitingServiceWorker) {
                    // We send the SKIP_WAITING message to tell the Service Worker
                    // to update its cache and flush the old one
                    waitingServiceWorker.postMessage({ type: 'SKIP_WAITING' });
                }
            },
        }),
        [isUpdateAvailable, waitingServiceWorker],
    );

    return <ServiceWorkerContext.Provider value={value} children={children} />;
};
export default React.memo(ServiceWorkerProvider);

// With this React Hook we'll be able to access `isUpdateAvailable` and `updateAssets`
export const useServiceWorker = () => React.useContext(ServiceWorkerContext);
