import preval from 'preval.macro';
import { FormattedDate } from 'react-intl';
import packageJson from '../../package.json';
import appVersion from '../utils/app-version';

const buildTimestamp: number = preval`module.exports = Date.now();`;

const VersionComponent = () => (
    <div style={{ fontSize: '0.6rem', color: '#9e9e9e' }}>
        {packageJson.version}
        -T
        {String(buildTimestamp).slice(-7)} Beta [{appVersion.v}] (
        <FormattedDate month="2-digit" day="2-digit" hour="2-digit" minute="2-digit" value={new Date(buildTimestamp)} />
        )
    </div>
);

export default VersionComponent;
