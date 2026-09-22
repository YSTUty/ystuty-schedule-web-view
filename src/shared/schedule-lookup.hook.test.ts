// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';

import {
  resetScheduleLookupMemoryCache,
  setMemoryCachedLookup,
} from './schedule-lookup-memory-cache';
import {
  getScheduleLookupSnapshot,
  type ScheduleLookupConfig,
} from './schedule-lookup.hook';

const lookupConfig: ScheduleLookupConfig<string> = {
  apiPath: 'v1/schedule/test',
  cacheKey: 'lookup-test',
  cachedMessage: 'Тестовый кэш.',
};

describe('getScheduleLookupSnapshot', () => {
  afterEach(() => {
    resetScheduleLookupMemoryCache();
  });

  it('returns the current in-memory lookup for non-React callers', () => {
    setMemoryCachedLookup(lookupConfig.cacheKey, ['value']);

    expect(getScheduleLookupSnapshot(lookupConfig)).toEqual(['value']);
  });

  it('returns null when no synchronous lookup source exists', () => {
    expect(getScheduleLookupSnapshot(lookupConfig)).toBeNull();
  });
});
