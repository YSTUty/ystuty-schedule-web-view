import React from 'react';
import { useLocation, useNavigate } from 'react-router';

import { isRestorableAppRoute } from './telegram-last-route.utils';
import {
  getTelegramMiniAppStartParam,
  getTelegramStoredValue,
  saveTelegramStoredValue,
} from './telegram.sdk';

const LAST_ROUTE_STORAGE_KEY = 'ystuty.schedule.last-route';
const RESTORE_LAST_ROUTE_START_PARAM = 'last';

function getStoredLastRoute(): string | null {
  try {
    return localStorage.getItem(LAST_ROUTE_STORAGE_KEY);
  } catch {
    return null;
  }
}

function saveLastRoute(route: string): void {
  try {
    localStorage.setItem(LAST_ROUTE_STORAGE_KEY, route);
  } catch {
    // Браузер может запрещать LocalStorage в приватном или встроенном режиме.
  }

  void saveTelegramStoredValue(LAST_ROUTE_STORAGE_KEY, route);
}

/**
 * Сохраняет последнюю внутреннюю страницу и восстанавливает её при запуске
 * Mini App по `startapp=last`. CloudStorage синхронизирует маршрут между
 * Telegram-клиентами, а LocalStorage остаётся быстрым локальным fallback.
 */
const TelegramLastRoute = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const shouldRestoreRouteRef = React.useRef(
    location.pathname === '/' &&
      getTelegramMiniAppStartParam() === RESTORE_LAST_ROUTE_START_PARAM,
  );
  const [isRestoring, setIsRestoring] = React.useState(
    shouldRestoreRouteRef.current,
  );
  const pathnameRef = React.useRef(location.pathname);

  React.useEffect(() => {
    pathnameRef.current = location.pathname;
  }, [location.pathname]);

  React.useEffect(() => {
    if (!shouldRestoreRouteRef.current) {
      return;
    }

    let isCurrent = true;

    void getTelegramStoredValue(LAST_ROUTE_STORAGE_KEY)
      .then((cloudRoute) => {
        const lastRoute = cloudRoute || getStoredLastRoute();

        if (
          isCurrent &&
          pathnameRef.current === '/' &&
          isRestorableAppRoute(lastRoute)
        ) {
          navigate(lastRoute, { replace: true });
        }
      })
      .finally(() => {
        if (isCurrent) {
          setIsRestoring(false);
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [navigate]);

  React.useEffect(() => {
    if (!isRestoring && isRestorableAppRoute(location.pathname)) {
      saveLastRoute(location.pathname);
    }
  }, [isRestoring, location.pathname]);

  return null;
};

export default TelegramLastRoute;
