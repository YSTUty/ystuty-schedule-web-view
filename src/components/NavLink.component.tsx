import React from 'react';
import { history } from '../store';

const NavLinkComponent = (props: any) => {
    let { to, href, children, isDisabled, tag, ...otherProps } = props;
    if (!to && href) {
        to = href;
    }

    const onClick = React.useCallback(
        (e) => {
            if (isDisabled) {
                e.preventDefault();
                e.stopPropagation();
                return undefined;
            }

            if (!e.ctrlKey && !e.metaKey) {
                e.preventDefault();
                e.stopPropagation();
                if (to !== window.location.pathname) {
                    history.push(to);
                }
            }
        },
        [isDisabled, to]
    );

    return 'button' === tag ? (
        <button type="button" {...otherProps} onClick={onClick}>
            {children}
        </button>
    ) : (
        <a href={to} {...otherProps} onClick={onClick}>
            {children}
        </a>
    );
};

NavLinkComponent.defaultProps = {
    tag: 'a',
};

export default NavLinkComponent;
