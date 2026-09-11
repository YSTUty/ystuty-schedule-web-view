import { describe, expect, it } from 'vitest';

import { buildApiUrl } from './api.utils';

describe('buildApiUrl', () => {
  const apiBaseUrl = 'https://api.example.test/s/schedule';

  it('appends an endpoint to the API base path', () => {
    expect(buildApiUrl(apiBaseUrl, 'v1/schedule/actual_groups')).toBe(
      'https://api.example.test/s/schedule/v1/schedule/actual_groups',
    );
  });

  it('normalizes duplicate boundary slashes', () => {
    expect(buildApiUrl(`${apiBaseUrl}/`, '/v1/schedule/actual_groups')).toBe(
      'https://api.example.test/s/schedule/v1/schedule/actual_groups',
    );
  });

  it('does not allow replacing the API host or leaving its base path', () => {
    expect(() =>
      buildApiUrl(apiBaseUrl, 'https://other.example.test/api'),
    ).toThrow('API endpoint must be a relative path');
    expect(() => buildApiUrl(apiBaseUrl, '../private')).toThrow(
      'API endpoint must not leave the API base path',
    );
  });
});
