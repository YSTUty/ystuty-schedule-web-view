import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { notifyTelegramImpact } from '@/shared/telegram/telegram.sdk';

const NavLinkComponent = React.forwardRef<
  HTMLAnchorElement | HTMLButtonElement,
  {
    tag?: 'a' | 'button';
    to?: string;
    href?: string;
    isDisabled?: boolean;
    [P: string]: any;
  }
>((props, ref) => {
  let { to, href, children, isDisabled, tag, ...otherProps } = props;
  const location = useLocation();
  const navigate = useNavigate();

  if (!to && href) {
    to = href;
  }

  const onClick = React.useCallback(
    (e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>) => {
      if (isDisabled) {
        e.preventDefault();
        e.stopPropagation();
        return undefined;
      }

      if (!e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        e.stopPropagation();
        if (to && to !== location.pathname) {
          // Параметры host-приложения могут находиться в search или hash.
          notifyTelegramImpact();
          navigate({
            pathname: to,
            search: location.search,
            hash: location.hash,
          });
        }
      }
    },
    [isDisabled, location.pathname, navigate, to],
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
