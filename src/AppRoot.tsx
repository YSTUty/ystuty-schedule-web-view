import { Provider } from 'react-redux';
import { Router } from 'react-router';

import LoadingUpdatesComponent from '@/components/LoadingUpdates.component';
import LocalizerComponent from '@/components/Localizer.component';
import { ThemeModeProvider } from '@/components/ThemeMode.component';
import { YandexMetrika } from '@/components/YandexMetrika.component';
import AppContainer from '@/containers/App/App.container';
import ServiceWorkerProvider from '@/shared/ServiceWorker.provider';
import { history } from '@/store';
import store from '@/store';

const AppRoot = () => (
  <Provider store={store}>
    <LocalizerComponent>
      <ThemeModeProvider>
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
);

export default AppRoot;
