import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
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
