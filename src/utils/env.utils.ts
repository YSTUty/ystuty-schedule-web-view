export const apiPath = getApiPath();

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

function getApiPath() {
  const apiPath_key = 'apiPath_v1';

  const apiPathFromUrl = new URLSearchParams(window.location.search).get(
    'apiPath',
  );
  const apiPathFromStorage = localStorage.getItem(apiPath_key);
  const apiPathFromEnvMain = import.meta.env.VITE_API_URL;
  const apiPathFromEnvForInternal = import.meta.env.VITE_API_URL_INTERNAL;
  const apiPathFromEnv = window.location.hostname.endsWith('.ystu')
    ? apiPathFromEnvForInternal
    : apiPathFromEnvMain;
  const apiPathFromWindow = `//${window.location.host}/api`;

  const apiPath =
    apiPathFromUrl || apiPathFromStorage || apiPathFromEnv || apiPathFromWindow;
  localStorage.setItem(apiPath_key, apiPath);

  if (apiPathFromUrl) {
    const s = new URLSearchParams(window.location.search);
    s.delete('apiPath');
    window.location.search = s.toString();
  }

  return apiPath;
}
