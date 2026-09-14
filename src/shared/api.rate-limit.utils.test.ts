import { afterEach, describe, expect, it } from 'vitest';

import {
  getApiRateLimitCooldownSeconds,
  resetApiRateLimitCooldown,
  setApiRateLimitCooldown,
} from './api.rate-limit.utils';

describe('api.rate-limit.utils', () => {
  afterEach(() => {
    resetApiRateLimitCooldown();
  });

  it('keeps the longest active cooldown', () => {
    expect(setApiRateLimitCooldown(8, 1_000)).toBe(true);
    expect(setApiRateLimitCooldown(3, 2_000)).toBe(false);
    expect(getApiRateLimitCooldownSeconds(3_000)).toBe(6);
  });

  it('expires the cooldown after its timeout', () => {
    setApiRateLimitCooldown(2, 1_000);

    expect(getApiRateLimitCooldownSeconds(3_000)).toBe(0);
  });
});
