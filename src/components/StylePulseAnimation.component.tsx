import { styled } from '@mui/material/styles';
import Autocomplete from '@mui/material/Autocomplete';

// export const StyledPulseAnumation = (Component: any) =>

export const StyledAutocomplete = styled(Autocomplete)((theme) => ({
    ['&.pulsation']: {
        transform: 'scale(1)',
        transition: 'all .2s ease-in-out',
        ['& input:not(:focus), &:not(:hover)']: {
            animation: `pulseEffect 2000ms infinite`,
        },
    },
    '@keyframes pulseEffect': {
        '0%': {
            transform: 'scale(0.95)',
            boxShadow: '0 0 0 0 rgba(255, 177, 66, 0.9)',
        },
        '70%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 10px rgba(255, 177, 66, 0)',
        },
        '100%': {
            transform: 'scale(0.95)',
            boxShadow: '0 0 0 0 rgba(255, 177, 66, 0)',
        },
    },
}));
