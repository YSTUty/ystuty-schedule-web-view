import {
  backButton,
  cloudStorage,
  hapticFeedback,
  init,
  initData,
  isTMA,
  miniApp,
  retrieveLaunchParams,
  swipeBehavior,
  themeParams,
  viewport,
} from '@tma.js/sdk-react';

import { configureTelegramMiniAppViewport } from './telegram-viewport.utils';

let isTelegramMiniAppInitialized = false;

/**
 * Инициализирует возможности Telegram Mini App без влияния на обычный веб-режим.
 *
 * Ошибки SDK не должны мешать открыть расписание в браузере или во встроенном
 * WebView устаревшей версии Telegram.
 */
export function initializeTelegramMiniApp(): boolean {
  if (!isTMA()) {
    return false;
  }

  try {
    init();
    configureTelegramMiniAppViewport();

    if (!themeParams.isMounted()) {
      themeParams.mount();
    }
    if (!themeParams.isCssVarsBound()) {
      themeParams.bindCssVars();
    }

    if (!miniApp.isMounted()) {
      miniApp.mount();
    }
    if (!miniApp.isCssVarsBound()) {
      miniApp.bindCssVars();
    }
    miniApp.setBgColor('bg_color');
    miniApp.setHeaderColor('bg_color');

    // if (backButton.isSupported() && !backButton.isMounted()) {
    //   backButton.mount();
    // }
    backButton.mount.ifAvailable();
    // mainButton.mount.ifAvailable();
    // secondaryButton.mount.ifAvailable();
    initData.restore();

    if (viewport.mount.isAvailable()) {
      void viewport
        .mount()
        .then(() => {
          if (!viewport.isCssVarsBound()) {
            viewport.bindCssVars();
          }

          if (viewport.expand.isAvailable()) {
            viewport.expand();
          }
        })
        .catch(() => undefined);
    }

    if (swipeBehavior.mount.isAvailable()) {
      swipeBehavior.mount();
    }

    if (swipeBehavior.disableVertical.isAvailable()) {
      swipeBehavior.disableVertical();
    }

    document.documentElement.dataset.telegramMiniApp = 'true';
    isTelegramMiniAppInitialized = true;

    return true;
  } catch {
    return false;
  }
}

/** Возвращает true только после успешной инициализации Telegram SDK. */
export function isTelegramMiniApp(): boolean {
  return isTelegramMiniAppInitialized;
}

/** Скрывает системную заглушку Telegram после первичного рендера приложения. */
export function notifyTelegramMiniAppReady(): void {
  if (isTelegramMiniAppInitialized) {
    miniApp.ready();
  }
}

/** Добавляет лёгкую тактильную реакцию, если она доступна в Telegram-клиенте. */
export function notifyTelegramSelectionChanged(): void {
  if (isTelegramMiniAppInitialized && hapticFeedback.isSupported()) {
    hapticFeedback.selectionChanged();
  }
}

/** Добавляет мягкий отклик на нажатие, если Telegram-клиент его поддерживает. */
export function notifyTelegramImpact(): void {
  if (isTelegramMiniAppInitialized && hapticFeedback.isSupported()) {
    hapticFeedback.impactOccurred('light');
  }
}

/**
 * Сообщает Telegram о результате пользовательского действия.
 * Успешные загрузки ограничиваются интервалом, чтобы серия запросов не создавала
 * навязчивую вибрацию при выборе нескольких групп.
 */
let lastSuccessHapticAt = 0;
export function notifyTelegramResult(
  type: 'success' | 'warning' | 'error',
): void {
  if (!isTelegramMiniAppInitialized || !hapticFeedback.isSupported()) {
    return;
  }

  if (type === 'success') {
    const now = Date.now();
    if (now - lastSuccessHapticAt < 1_500) {
      return;
    }
    lastSuccessHapticAt = now;
  }

  hapticFeedback.notificationOccurred(type);
}

/** Возвращает значение `startapp` после инициализации SDK Telegram. */
export function getTelegramMiniAppStartParam(): string | undefined {
  if (!isTelegramMiniAppInitialized) {
    return undefined;
  }

  try {
    const initDataStartParam = initData.startParam();
    if (initDataStartParam) {
      return initDataStartParam;
    }
  } catch {
    // Telegram Desktop может открыть Mini App без initData.
  }

  /**
   * Обычно Telegram переносит `startapp` в `tgWebAppStartParam`, но Telegram
   * Desktop может оставить исходный параметр в query и не передать initData.
   */
  const searchParams = new URLSearchParams(window.location.search);
  return (
    getTelegramLaunchStartParam() ||
    searchParams.get('tgWebAppStartParam') ||
    searchParams.get('startapp') ||
    undefined
  );
}

/** Безопасно получает start-параметр из всех источников, известных TMA SDK. */
function getTelegramLaunchStartParam(): string | undefined {
  try {
    return retrieveLaunchParams().tgWebAppStartParam;
  } catch {
    return undefined;
  }
}

/**
 * Читает CloudStorage, когда Mini App и версия Telegram его поддерживают.
 * При любой ошибке вызывающий код использует локальный fallback.
 */
export async function getTelegramStoredValue(
  key: string,
): Promise<string | null> {
  if (!isTelegramMiniAppInitialized || !cloudStorage.isSupported()) {
    return null;
  }

  try {
    return (await cloudStorage.getItem(key)) || null;
  } catch {
    return null;
  }
}

/** Сохраняет значение в CloudStorage без влияния на обычную веб-версию. */
export async function saveTelegramStoredValue(
  key: string,
  value: string,
): Promise<void> {
  if (!isTelegramMiniAppInitialized || !cloudStorage.isSupported()) {
    return;
  }

  try {
    await cloudStorage.setItem(key, value);
  } catch {
    // CloudStorage не должен мешать приложению при старом Telegram-клиенте.
  }
}
