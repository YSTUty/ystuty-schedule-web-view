export const linkYSTUty = import.meta.env.VITE_LINK_YSTUTY;
export const linkToGitHub = import.meta.env.VITE_LINK_2GH;
export const linkToVK = import.meta.env.VITE_LINK_2VK;
export const linkToICS = import.meta.env.VITE_LINK_2ICS;
export const linkToSupport = import.meta.env.VITE_LINK_SUPPORT;

export const pwaHostname = import.meta.env.VITE_PWA_HOST;
export const pwaHostnameOld = import.meta.env.VITE_PWA_HOST_OLD;
export const telegramUsername = import.meta.env.VITE_TELEGRAM_USERNAME;
export const telegramBotName = import.meta.env.VITE_TELEGRAM_BOT_NAME;
export const vkBotGroupName = import.meta.env.VITE_VK_BOT_GROUP_NAME;

export const vkWidgetsApiId =
  import.meta.env.VITE_VK_WIDGETS_API_ID &&
  !isNaN(+import.meta.env.VITE_VK_WIDGETS_API_ID)
    ? +import.meta.env.VITE_VK_WIDGETS_API_ID
    : undefined;

const API_PATH_QUERY_PARAM = 'apiPath';
const API_PATH_SESSION_STORAGE_KEY = 'apiPath_v2';
const LEGACY_API_PATH_STORAGE_KEY = 'apiPath_v1';

/** Убирает завершающий слеш, чтобы корректно склеивать API-путь с endpoint. */
function normalizeApiPath(value: string | undefined) {
  if (!value) {
    return undefined;
  }

  try {
    const url = new URL(value, window.location.origin);
    if (!['http:', 'https:'].includes(url.protocol)) {
      return undefined;
    }

    return url.href.replace(/\/$/, '');
  } catch {
    return undefined;
  }
}

/** Проверяет, открыт ли сайт из внутренней сети университета. */
function isInternalHostname(hostname: string) {
  return hostname === 'ystu' || hostname.endsWith('.ystu');
}

/**
 * Выбирает API для текущего запуска приложения.
 *
 * Параметр `apiPath` оставлен для отладки и тестовых стендов, но хранится
 * только в пределах текущей вкладки, чтобы не переопределять API новой сборки.
 */
function getApiPath() {
  const url = new URL(window.location.href);
  const apiPathFromUrl = normalizeApiPath(
    url.searchParams.get(API_PATH_QUERY_PARAM) ?? undefined,
  );

  if (url.searchParams.has(API_PATH_QUERY_PARAM)) {
    url.searchParams.delete(API_PATH_QUERY_PARAM);
    window.history.replaceState(
      window.history.state,
      '',
      `${url.pathname}${url.search}${url.hash}`,
    );
  }

  if (apiPathFromUrl) {
    sessionStorage.setItem(API_PATH_SESSION_STORAGE_KEY, apiPathFromUrl);
  }

  // Однократно очищаем постоянный override из старой версии приложения.
  localStorage.removeItem(LEGACY_API_PATH_STORAGE_KEY);

  const apiPathFromSession = normalizeApiPath(
    sessionStorage.getItem(API_PATH_SESSION_STORAGE_KEY) ?? undefined,
  );
  const apiPathFromEnv = isInternalHostname(window.location.hostname)
    ? import.meta.env.VITE_API_URL_INTERNAL
    : import.meta.env.VITE_API_URL;

  return (
    apiPathFromUrl ??
    apiPathFromSession ??
    normalizeApiPath(apiPathFromEnv) ??
    `${window.location.origin}/api`
  );
}

export const apiPath = getApiPath();
