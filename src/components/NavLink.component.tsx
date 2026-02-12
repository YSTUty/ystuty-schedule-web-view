import React from 'react';
import { history } from '../store';

const NavLinkComponent = React.forwardRef<
    HTMLAnchorElement | HTMLButtonElement,
    { tag?: 'a' | 'button'; to?: string; href?: string; isDisabled?: boolean; [P: string]: any }
>((props, ref) => {
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
                    history.push(to!);
                }
            }
        },
        [isDisabled, to],
    );

    return 'button' === tag ? (
        <button ref={ref as any} type="button" {...otherProps} onClick={onClick}>
            {children}
        </button>
    ) : (
        <a ref={ref as any} href={to} {...otherProps} onClick={onClick}>
            {children}
        </a>
    );
});

NavLinkComponent.defaultProps = {
    tag: 'a' as const,
};

export default NavLinkComponent;
