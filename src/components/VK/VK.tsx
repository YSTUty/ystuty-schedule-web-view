import React from 'react';
import PropTypes from 'prop-types';

import VKContext from './VKContext';
import VKApi, { VKApiOptions } from './vkApi';

export const isDOMReady = typeof window !== 'undefined' && window.document && window.document.createElement;

export type Props = {
    apiId?: number | null;
    options?: VKApiOptions;
    onApiAvailable?: (api: any) => void;
    children: React.ReactNode;
};

const VK: React.FC<Props> = ({ onApiAvailable, apiId, options, children }) => {
    const [vk, setVK] = React.useState<any>(null);

    React.useEffect(() => {
        if (isDOMReady) {
            new VKApi(apiId!, options).load().then((api) => {
                onApiAvailable?.(api);
                setVK(api);
            });
        }
    }, []);

    if (!vk) {
        return null;
    }

    return <VKContext.Provider value={vk}>{children}</VKContext.Provider>;
};

VK.propTypes = {
    apiId: PropTypes.number,
    options: PropTypes.shape({
        version: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
        onlyWidgets: PropTypes.bool,
    }),
    onApiAvailable: PropTypes.func,
};

VK.defaultProps = {
    apiId: null,
    options: {
        version: 168,
        onlyWidgets: true,
    },
    onApiAvailable: () => {},
};

export default VK;
