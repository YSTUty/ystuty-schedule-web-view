export const apiPath = getApiPath();

export const linkYSTUty = process.env.REACT_APP_LINK_YSTUTY;
export const linkToGitHub = process.env.REACT_APP_LINK_2GH;
export const linkToVK = process.env.REACT_APP_LINK_2VK;
export const linkToICS = process.env.REACT_APP_LINK_2ICS;

export const pwaHostname = process.env.REACT_APP_PWA_HOST;
export const pwaHostnameOld = process.env.REACT_APP_PWA_HOST_OLD;
export const telegramUsername = process.env.REACT_APP_TELEGRAM_USERNAME;
export const telegramBotName = process.env.REACT_APP_TELEGRAM_BOT_NAME;
export const vkBotGroupName = process.env.REACT_APP_VK_BOT_GROUP_NAME;

export const vkWidgetsApiId =
    process.env.REACT_APP_VK_WIDGETS_API_ID && !isNaN(+process.env.REACT_APP_VK_WIDGETS_API_ID)
        ? +process.env.REACT_APP_VK_WIDGETS_API_ID
        : undefined;

function getApiPath() {
    const apiPathFromUrl = new URLSearchParams(window.location.search).get('apiPath');
    const apiPathFromStorage = localStorage.getItem('apiPath');
    const apiPathFromEnv = process.env.REACT_APP_API_URL;
    const apiPathFromWindow = `//${window.location.host}/api`;

    const apiPath = apiPathFromUrl || apiPathFromStorage || apiPathFromEnv || apiPathFromWindow;
    localStorage.setItem('apiPath', apiPath);

    if (apiPathFromUrl) {
        const s = new URLSearchParams(window.location.search);
        s.delete('apiPath');
        window.location.search = s.toString();
    }

    return apiPath;
}
