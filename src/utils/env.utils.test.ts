// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

async function loadApiPath(search = '') {
  window.history.replaceState(null, '', `/${search}`);
  vi.resetModules();

  const { apiPath } = await import('./env.utils');

  return apiPath;
}

describe('apiPath', () => {
  beforeEach(() => {
    localStorage.clear();
    sessionStorage.clear();
    vi.stubEnv('VITE_API_URL', 'https://api.example.test/s/schedule');
    vi.stubEnv('VITE_API_URL_INTERNAL', 'https://api-internal.example.test');
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('uses the API URL from the build instead of a legacy localStorage override', async () => {
    localStorage.setItem('apiPath_v1', 'https://obsolete.example.test/api');

    await expect(loadApiPath()).resolves.toBe(
      'https://api.example.test/s/schedule',
    );
    expect(localStorage.getItem('apiPath_v1')).toBeNull();
  });

  it('keeps an API URL from the query only for the current tab', async () => {
    await expect(
      loadApiPath(
        '?apiPath=https%3A%2F%2Fstaging.example.test%2Fschedule%2F&view=group',
      ),
    ).resolves.toBe('https://staging.example.test/schedule');
    expect(window.location.search).toBe('?view=group');

    await expect(loadApiPath()).resolves.toBe(
      'https://staging.example.test/schedule',
    );
  });

  it('ignores unsupported API URL protocols', async () => {
    await expect(loadApiPath('?apiPath=javascript%3Aalert(1)')).resolves.toBe(
      'https://api.example.test/s/schedule',
    );
    expect(sessionStorage.getItem('apiPath_v2')).toBeNull();
  });
});
