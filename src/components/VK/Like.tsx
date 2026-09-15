import React from 'react';

import VKContext from './VKContext';

export type Props = {
  elementId?: string;
  options?: {
    type?: 'full' | 'button' | 'mini' | 'vertical' | null;
    width?: number | null;
    height?: number | null;
    verb?: 0 | 1 | null;
    pageUrl?: string | null;
    pageTitle?: string | null;
    pageImage?: string | null;
  };
  pageId?: string | null;
  onLike?: (quantity: number) => void;
  onUnlike?: (quantity: number) => void;
  onShare?: (quantity: number) => void;
  onUnshare?: (quantity: number) => void;
};

const DEFAULT_LIKE_OPTIONS: NonNullable<Props['options']> = {
  height: 22,
  type: 'full',
  verb: 0,
  width: 350,
};

const Like: React.FC<Props> = ({
  elementId = 'vk_like',
  options = DEFAULT_LIKE_OPTIONS,
  pageId = null,
  onLike,
  onUnlike,
  onShare,
  onUnshare,
}) => {
  const vk = React.useContext(VKContext);
  const elementRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const element = elementRef.current;

    if (element && !element.dataset.vkLikeInitialized) {
      vk.Widgets.Like(elementId, options, pageId || undefined);
      element.dataset.vkLikeInitialized = 'true';
    }

    vk.Observer.subscribe('widgets.like.liked', (quantity: number) =>
      onLike?.(quantity),
    );
    vk.Observer.subscribe('widgets.like.unliked', (quantity: number) =>
      onUnlike?.(quantity),
    );
    vk.Observer.subscribe('widgets.like.shared', (quantity: number) =>
      onShare?.(quantity),
    );
    vk.Observer.subscribe('widgets.like.unshared', (quantity: number) =>
      onUnshare?.(quantity),
    );

    return () => {
      vk.Observer.unsubscribe('widgets.like.liked');
      vk.Observer.unsubscribe('widgets.like.unliked');
      vk.Observer.unsubscribe('widgets.like.shared');
      vk.Observer.unsubscribe('widgets.like.unshared');
    };
  }, [elementId, onLike, onShare, onUnlike, onUnshare, options, pageId, vk]);

  return <div id={elementId} ref={elementRef} />;
};

export default Like;
