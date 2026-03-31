import preval from 'preval.macro';

export type AppVersion = { version: string };

const appVersion: AppVersion = preval`module.exports = require('../../public/version.json');`;

export default appVersion;
