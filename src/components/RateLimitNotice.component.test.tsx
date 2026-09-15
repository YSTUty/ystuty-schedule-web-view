// @vitest-environment jsdom
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';

import {
  resetApiRateLimitCooldown,
  setApiRateLimitCooldown,
} from '@/shared/api.rate-limit.utils';
import RateLimitNotice from './RateLimitNotice.component';

describe('RateLimitNotice', () => {
  afterEach(() => {
    resetApiRateLimitCooldown();
  });

  it('shows an active rate limit and lets the user dismiss it', () => {
    setApiRateLimitCooldown({ limit: 5, remaining: 0, resetAfter: 8 });

    render(<RateLimitNotice />);

    expect(screen.getByText('Слишком много запросов к серверу')).not.toBeNull();

    fireEvent.click(
      screen.getByLabelText('Закрыть уведомление о лимите запросов'),
    );

    expect(screen.queryByText('Слишком много запросов к серверу')).toBeNull();
  });
});
