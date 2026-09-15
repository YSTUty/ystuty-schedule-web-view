import React from 'react';

import VKApi, { VKApiOptions } from './vkApi';
import VKContext from './VKContext';

export const isDOMReady =
  typeof window !== 'undefined' &&
  window.document &&
  window.document.createElement;

export type Props = {
  apiId?: number | null;
  options?: VKApiOptions;
  onApiAvailable?: (api: any) => void;
  children: React.ReactNode;
};

const DEFAULT_VK_OPTIONS: VKApiOptions = {
  onlyWidgets: true,
  version: 168,
};

const VK: React.FC<Props> = ({
  apiId = null,
  children,
  onApiAvailable,
  options = DEFAULT_VK_OPTIONS,
}) => {
  const [vk, setVK] = React.useState<any>(null);

  React.useEffect(() => {
    let isMounted = true;

    if (isDOMReady) {
      new VKApi(apiId, options)
        .load()
        .then((api) => {
          if (!isMounted) {
            return;
          }

          onApiAvailable?.(api);
          setVK(api);
        })
        .catch(() => {});
    }

    return () => {
      isMounted = false;
    };
  }, []);

  if (!vk) {
    return null;
  }

  return <VKContext.Provider value={vk}>{children}</VKContext.Provider>;
};

export default VK;
