import { describe, expect, it } from 'vitest';

import {
  getResponseError,
  getRetryAfterSeconds,
  isAbortError,
} from './api.response.utils';

describe('getResponseError', () => {
  it('returns a normalized API error from an expected payload', () => {
    expect(
      getResponseError({
        error: {
          code: 422,
          error: 'Validation failed',
          message: 'Некорректные данные',
          validation: [],
        },
      }),
    ).toEqual({
      code: 422,
      error: 'Validation failed',
      message: 'Некорректные данные',
      validation: [],
      payload: undefined,
    });
  });

  it('ignores malformed error payloads', () => {
    expect(getResponseError({ error: {} })).toBeUndefined();
    expect(getResponseError({ message: 'Ошибка' })).toBeUndefined();
    expect(getResponseError(null)).toBeUndefined();
  });
});

describe('getRetryAfterSeconds', () => {
  it('supports seconds and an HTTP date', () => {
    expect(getRetryAfterSeconds('12')).toBe(12);
    expect(
      getRetryAfterSeconds(
        'Fri, 11 Sep 2026 10:00:10 GMT',
        Date.UTC(2026, 8, 11, 10),
      ),
    ).toBe(10);
  });

  it('uses a safe fallback for an invalid header', () => {
    expect(getRetryAfterSeconds('invalid')).toBe(1);
  });
});

describe('isAbortError', () => {
  it('recognizes abort errors without relying on DOMException', () => {
    expect(isAbortError({ name: 'AbortError' })).toBe(true);
    expect(isAbortError('Canceled fetch')).toBe(true);
    expect(isAbortError(new Error('Network error'))).toBe(false);
  });
});
