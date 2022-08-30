import styled from '@mui/styled-engine';
import preval from 'preval.macro';
import { FormattedDate } from 'react-intl';
import appVersion from '../utils/app-version';

const buildTimestamp: number = preval`module.exports = Date.now();`;

const StyledDate = styled('div')(() => ({
    display: 'inline',
    '@media (max-width: 540px)': {
        display: 'none',
    },
}));

const VersionComponent = () => (
    <div style={{ fontSize: '0.6rem', color: '#9e9e9e' }}>
        Beta [{appVersion.v}]
        <StyledDate>
            {' ('}
            <FormattedDate
                month="2-digit"
                day="2-digit"
                hour="2-digit"
                minute="2-digit"
                value={new Date(buildTimestamp)}
            />
            )
        </StyledDate>
    </div>
);

export default VersionComponent;
