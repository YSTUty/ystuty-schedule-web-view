import {
  backButton,
  hapticFeedback,
  init,
  isTMA,
  miniApp,
  swipeBehavior,
  themeParams,
  viewport,
} from '@tma.js/sdk-react';

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
    // initData.restore();

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
