import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import * as Sentry from '@sentry/react';

import 'react-toastify/dist/ReactToastify.css';
import './index.css';

import AppRoot from '@/AppRoot';
import EnvUnsupported from '@/components/EnvUnsupported.component';
import ErrorBoundary from '@/components/ErrorBoundary.component';
import { restoreGitHubPagesPath } from '@/shared/github-pages-routing.utils';
import {
  initializeTelegramMiniApp,
  notifyTelegramMiniAppReady,
} from '@/shared/telegram/telegram.sdk';
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

const root = createRoot(rootElement);

try {
  restoreGitHubPagesPath();
  initializeMonitoring();
  prepareHostPlatform();
  initializeTelegramMiniApp();

  root.render(
    <StrictMode>
      <ErrorBoundary>
        <AppRoot />
      </ErrorBoundary>
    </StrictMode>,
  );

  requestAnimationFrame(notifyTelegramMiniAppReady);
} catch (error) {
  const startupError =
    error instanceof Error ? error : new Error('Failed to start application');
  hawk?.captureError(startupError);

  root.render(<EnvUnsupported error={startupError} />);
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
