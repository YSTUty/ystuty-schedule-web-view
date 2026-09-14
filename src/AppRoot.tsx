import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import LoadingUpdatesComponent from '@/components/LoadingUpdates.component';
import LocalizerComponent from '@/components/Localizer.component';
import { ThemeModeProvider } from '@/components/ThemeMode.component';
import { YandexMetrika } from '@/components/YandexMetrika.component';
import AppContainer from '@/containers/App/App.container';
import ServiceWorkerProvider from '@/shared/ServiceWorker.provider';
import TelegramBackButton from '@/shared/telegram/TelegramBackButton.component';
import store from '@/store';

const AppRoot = () => (
  <Provider store={store}>
    <LocalizerComponent>
      <ThemeModeProvider>
        <BrowserRouter>
          <TelegramBackButton />
          <ServiceWorkerProvider>
            <LoadingUpdatesComponent>
              <AppContainer />
            </LoadingUpdatesComponent>
          </ServiceWorkerProvider>
        </BrowserRouter>
      </ThemeModeProvider>
      <YandexMetrika />
    </LocalizerComponent>
  </Provider>
);

export default AppRoot;
