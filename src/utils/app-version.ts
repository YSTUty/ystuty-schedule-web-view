import preval from 'preval.macro';

const appVersion: { v: string } = preval`module.exports = require('../../public/version.json');`;

export default appVersion;
