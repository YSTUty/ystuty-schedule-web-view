import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import * as Sentry from '@sentry/react';
import './utils/hawk.util';
import store, { history } from './store';

import 'react-toastify/dist/ReactToastify.css';
import './index.css';

import AppContainer from './containers/App/App.container';
import { ThemeModeProvider } from './components/ThemeMode.component';
import { YandexMetrika } from './components/YandexMetrika.component';
import LocalizerComponent from './components/Localizer.component';
import LoadingUpdatesComponent from './components/LoadingUpdates.component';

import ServiceWorkerProvider from './shared/ServiceWorker.provider';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';

if (process.env.NODE_ENV === 'production' && process.env.REACT_APP_SENTRY_DSN) {
    Sentry.init({
        dsn: process.env.REACT_APP_SENTRY_DSN,
        integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
        // Tracing
        tracesSampleRate: 1.0, //  Capture 100% of the transactions
        // // Set 'tracePropagationTargets' to control for which URLs distributed tracing should be enabled
        // tracePropagationTargets: ['localhost', /^https:\/\/[a-z0-9_\-]+\.ystuty\.ru/],
        // Session Replay
        replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
        replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
    });
}

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <LocalizerComponent>
                <ThemeModeProvider>
                    {/* <ToastContainer /> */}
                    <Router history={history}>
                        <ServiceWorkerProvider>
                            <LoadingUpdatesComponent>
                                <AppContainer />
                            </LoadingUpdatesComponent>
                        </ServiceWorkerProvider>
                    </Router>
                </ThemeModeProvider>
                <YandexMetrika />
            </LocalizerComponent>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
