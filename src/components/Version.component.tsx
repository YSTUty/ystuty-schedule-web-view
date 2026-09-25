import { FormattedDate } from 'react-intl';

import { styled } from '@mui/material/styles';

import appVersion from '@/utils/app-version';

const buildTimestamp = __BUILD_TIMESTAMP__;

const StyledVersion = styled('div')(({ theme }) => ({
  color: theme.palette.text.disabled,
  fontSize: '0.6rem',
  lineHeight: 1.2,
  // На iPhone нижняя системная область может перекрывать последний текст.
  paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 2px)',
}));

const StyledDate = styled('div')(() => ({
  display: 'inline',
  // '@media (max-width: 540px)': {
  //   display: 'none',
  // },
}));

const VersionComponent = () => (
  <StyledVersion>
    Beta [{appVersion.version}]
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
  </StyledVersion>
);

export default VersionComponent;
