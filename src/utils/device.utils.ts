export const isIOS = () =>
    (/iPad|iPhone|iPod/.test(navigator.platform) ||
        (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)) &&
    !(window as any).MSStream;

export const isAndroid = () => /(android)/i.test(navigator.userAgent);

export const isPWA = () => {
    try {
        return (
            window.matchMedia('(display-mode: standalone)').matches ||
            (window.navigator as any).standalone ||
            document.referrer.includes('android-app://') ||
            sessionStorage.getItem('PWA_MODE')
        );
    } catch {
        return false;
    }
};
