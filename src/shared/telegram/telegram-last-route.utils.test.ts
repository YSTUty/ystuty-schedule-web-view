import { describe, expect, it } from 'vitest';

import { isRestorableAppRoute } from './telegram-last-route.utils';

describe('isRestorableAppRoute', () => {
  it.each([
    '/',
    '/group',
    '/group/ЦИСБ-24',
    '/teacher/775',
    '/by_audience/Г-626',
    '/teacher-lessons/2334',
  ])('accepts an application route: %s', (route) => {
    expect(isRestorableAppRoute(route)).toBe(true);
  });

  it.each([
    '',
    'group',
    '/unknown',
    '/group/ЦИСБ-24?allow_multiple',
    '//external.example',
    'https://external.example',
  ])('rejects an unsafe or unknown route: %s', (route) => {
    expect(isRestorableAppRoute(route)).toBe(false);
  });
});
