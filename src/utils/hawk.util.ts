import HawkCatcher from '@hawk.so/javascript';

const token = process.env.REACT_APP_HAWK_TOKEN;
export const hawk = token ? new (HawkCatcher as any)({ token }) : {};
