import HawkCatcher from '@hawk.so/javascript';

const token = import.meta.env.VITE_HAWK_TOKEN;
const release = window.HAWK_RELEASE;
export const hawk = import.meta.env.PROD && token ? new HawkCatcher({ token, release }) : {};
