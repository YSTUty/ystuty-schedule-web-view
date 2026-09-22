import { describe, expect, it } from 'vitest';

import { getScheduleCacheState, scheduleApi } from './schedule-api';

describe('scheduleApi', () => {
  it('uses only the public semesterId query parameter', () => {
    expect(scheduleApi.actualGroups({ semesterId: 123 })).toBe(
      'v1/schedule/actual_groups?semesterId=123',
    );
    expect(
      scheduleApi.actualGroups({ semesterId: 123, additional: true }),
    ).toBe('v1/schedule/actual_groups?semesterId=123&additional=true');
  });

  it('encodes schedule selection identifiers in endpoint paths', () => {
    expect(scheduleApi.schedule('group', 'ЦИС 37', { semesterId: 123 })).toBe(
      'v1/schedule/group/%D0%A6%D0%98%D0%A1%2037?semesterId=123',
    );
  });

  it('rejects invalid public semester identifiers', () => {
    expect(() => scheduleApi.actualAudiences({ semesterId: 0 })).toThrow(
      'semesterId must be a positive integer',
    );
  });
});

describe('getScheduleCacheState', () => {
  it('prefers metadata from the current API contract', () => {
    expect(
      getScheduleCacheState({
        isCache: false,
        cache: { isCached: true, ttlSeconds: null },
      }),
    ).toEqual({ isCached: true, ttlSeconds: null });
  });

  it('supports the legacy cache flag during API rollout', () => {
    expect(getScheduleCacheState({ isCache: true })).toEqual({
      isCached: true,
      ttlSeconds: null,
    });
  });

  it('normalizes invalid cache TTL values to null', () => {
    expect(
      getScheduleCacheState({
        cache: { isCached: true, ttlSeconds: -1 },
      }),
    ).toEqual({ isCached: true, ttlSeconds: null });
  });
});
