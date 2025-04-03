import HawkCatcher from '@hawk.so/javascript';

const token = process.env.REACT_APP_HAWK_TOKEN;
const release = HAWK_RELEASE; // process.env.HAWK_RELEASE;
export const hawk = process.env.NODE_ENV === 'production' && token ? new HawkCatcher({ token, release }) : {};
