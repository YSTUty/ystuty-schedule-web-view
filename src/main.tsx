import React from 'react';
import ReactDOM from 'react-dom';

import * as Sentry from '@sentry/react';

import 'react-toastify/dist/ReactToastify.css';
import './index.css';

import AppRoot from '@/AppRoot';
import EnvUnsupported from '@/components/EnvUnsupported.component';
import ErrorBoundary from '@/components/ErrorBoundary.component';
import reportWebVitals from './reportWebVitals';
import { hawk } from './utils/hawk.util';
import { prepareHostPlatform } from './utils/platform.util';

/** Инициализирует необязательный мониторинг до отрисовки React-дерева. */
function initializeMonitoring() {
  if (isDev || !import.meta.env.VITE_SENTRY_DSN) {
    return;
  }

  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error('Root element "#root" was not found');
}

try {
  initializeMonitoring();
  prepareHostPlatform();

  ReactDOM.render(
    <React.StrictMode>
      <ErrorBoundary>
        <AppRoot />
      </ErrorBoundary>
    </React.StrictMode>,
    rootElement,
  );
} catch (error) {
  const startupError =
    error instanceof Error ? error : new Error('Failed to start application');
  hawk?.captureError(startupError);

  ReactDOM.render(<EnvUnsupported error={startupError} />, rootElement);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
