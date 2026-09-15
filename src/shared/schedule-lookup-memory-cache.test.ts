import { afterEach, describe, expect, it } from 'vitest';

import {
  getMemoryCachedLookup,
  resetScheduleLookupMemoryCache,
  setMemoryCachedLookup,
} from './schedule-lookup-memory-cache';

describe('schedule-lookup-memory-cache', () => {
  afterEach(() => {
    resetScheduleLookupMemoryCache();
  });

  it('keeps a lookup while navigating through the application', () => {
    setMemoryCachedLookup('actual-groups', ['ЦИСБ-24']);

    expect(getMemoryCachedLookup<string[]>('actual-groups')).toEqual([
      'ЦИСБ-24',
    ]);
  });

  it('does not use an expired lookup', () => {
    setMemoryCachedLookup('actual-groups', ['ЦИСБ-24']);
    const now = Date.now();

    expect(getMemoryCachedLookup('actual-groups', now + 120e3)).toBeNull();
  });
});
