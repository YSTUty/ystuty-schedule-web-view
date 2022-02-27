import React from 'react';
import { styled } from '@mui/material/styles';
import LinearProgress from '@mui/material/LinearProgress';

const StyledLinearProgress = styled(LinearProgress)(() => ({
    position: 'absolute',
    width: '100%',
    bottom: 0,
    left: 0,
}));

const StyledLoadingUpdate = styled('div')(() => ({
    position: 'absolute',
    width: '100%',
    height: '60px',
    margin: 'auto',
    right: 0,
    bottom: 0,
    top: 0,
    left: 0,
    textAlign: 'center',
    fontSize: '1.1em',
    whiteSpace: 'pre-line',
}));

const Loading = (props: any) => {
    return (
        <StyledLoadingUpdate>
            {props.children && props.children}
            <StyledLinearProgress />
        </StyledLoadingUpdate>
    );
};

export default React.memo(Loading);
