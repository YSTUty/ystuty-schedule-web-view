import HawkCatcher from '@hawk.so/javascript';

const token = import.meta.env.VITE_HAWK_TOKEN;
const release = window.HAWK_RELEASE;
export const hawk =
  !isDev && token ? new HawkCatcher({ token, release }) : null;
