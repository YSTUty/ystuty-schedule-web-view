export type AppPlatform = 'web' | 'telegram' | 'vk';

type HostWindow = Window & {
  Telegram?: {
    WebApp?: unknown;
  };
  vkBridge?: unknown;
};

/** Определяет хост без зависимости от SDK Telegram или VK. */
export function detectAppPlatform(
  search: string,
  hasTelegramWebApp = false,
  hasVkBridge = false,
): AppPlatform {
  const params = new URLSearchParams(search);

  if (
    hasTelegramWebApp ||
    params.has('tgWebAppPlatform') ||
    params.has('tgWebAppVersion')
  ) {
    return 'telegram';
  }

  if (hasVkBridge || params.has('vk_app_id') || params.has('vk_platform')) {
    return 'vk';
  }

  return 'web';
}

/**
 * Сохраняет текущий хост в DOM и оставляет единственную точку входа для SDK.
 *
 * После установки `@tma.js/sdk-react` здесь нужно вызвать `isTMA()` и
 * `retrieveLaunchParams()`, не меняя остальной bootstrap приложения.
 */
export function prepareHostPlatform(): AppPlatform {
  const hostWindow = window as HostWindow;
  const platform = detectAppPlatform(
    window.location.search,
    Boolean(hostWindow.Telegram?.WebApp),
    Boolean(hostWindow.vkBridge),
  );

  document.documentElement.dataset.hostPlatform = platform;
  return platform;
}
