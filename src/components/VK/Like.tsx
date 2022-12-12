import React from 'react';
import PropTypes from 'prop-types';
import VKContext from './VKContext';

export type Props = {
    elementId: string;
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

const __safe__likes: Record<any, any> = {};
const Like: React.FC<Props> = ({ elementId, options, pageId, onLike, onUnlike, onShare, onUnshare }) => {
    const vk = React.useContext(VKContext);

    React.useEffect(() => {
        // fix twice render by StrictMode
        if (!(elementId in __safe__likes)) {
            vk.Widgets.Like(elementId, options, pageId || undefined);
            // __safe__likes[elementId] = true;
        }

        vk.Observer.subscribe('widgets.like.liked', (quantity: number) => onLike?.(quantity));
        vk.Observer.subscribe('widgets.like.unliked', (quantity: number) => onUnlike?.(quantity));
        vk.Observer.subscribe('widgets.like.shared', (quantity: number) => onShare?.(quantity));
        vk.Observer.subscribe('widgets.like.unshared', (quantity: number) => onUnshare?.(quantity));

        return () => {
            vk.Observer.unsubscribe('widgets.like.liked');
            vk.Observer.unsubscribe('widgets.like.unliked');
            vk.Observer.unsubscribe('widgets.like.shared');
            vk.Observer.unsubscribe('widgets.like.unshared');
        };
    }, []);

    return <div id={elementId} />;
};

Like.propTypes = {
    elementId: PropTypes.string.isRequired,
    options: PropTypes.shape({
        type: PropTypes.oneOf(['full', 'button', 'mini', 'vertical'] as const),
        width: PropTypes.number,
        height: PropTypes.number,
        verb: PropTypes.oneOf([0, 1] as const),
        pageUrl: PropTypes.string,
        pageTitle: PropTypes.string,
        pageImage: PropTypes.string,
    }),
    pageId: PropTypes.string,
    onLike: PropTypes.func,
    onUnlike: PropTypes.func,
    onShare: PropTypes.func,
    onUnshare: PropTypes.func,
};

Like.defaultProps = {
    elementId: 'vk_like',
    options: {
        type: 'full',
        width: 350,
        height: 22,
        verb: 0,
    },
    pageId: null,
    onLike: () => {},
    onUnlike: () => {},
    onShare: () => {},
    onUnshare: () => {},
};

export default Like;
