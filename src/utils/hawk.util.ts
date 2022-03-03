const HawkCatcher = require('@hawk.so/javascript');

const token = process.env.REACT_APP_HAWK_TOKEN;
export const hawk = process.env.NODE_ENV === 'production' && token ? new (HawkCatcher as any)({ token }) : {};
