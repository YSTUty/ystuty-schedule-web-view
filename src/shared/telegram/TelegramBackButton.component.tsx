import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { backButton } from '@tma.js/sdk-react';

import {
  isTelegramMiniApp,
  notifyTelegramSelectionChanged,
} from './telegram.sdk';

/** Связывает системную кнопку Telegram с возвратом на стартовый экран расписания. */
const TelegramBackButton = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isTelegramMiniApp() || !backButton.isSupported()) {
      return;
    }

    if (location.pathname === '/') {
      backButton.hide();
      return;
    }

    backButton.show();
    return backButton.onClick(() => {
      notifyTelegramSelectionChanged();
      navigate('/');
    });
  }, [location.pathname, navigate]);

  return null;
};

export default TelegramBackButton;
