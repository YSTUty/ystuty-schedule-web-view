import { describe, expect, it } from 'vitest';

import {
  buildSchedulePath,
  getLegacySchedulePath,
  getScheduleSelectionFromPathname,
  normalizePathname,
} from './schedule-routing.utils';

describe('schedule-routing.utils', () => {
  it('stores selected groups in the path', () => {
    const path = buildSchedulePath('group', ['ИВТ-12', 'ИВТ-13']);

    expect(path).toBe('/group/%D0%98%D0%92%D0%A2-12%2C%D0%98%D0%92%D0%A2-13');
    expect(getScheduleSelectionFromPathname(path, 'group')).toEqual([
      'ИВТ-12',
      'ИВТ-13',
    ]);
  });

  it('redirects old schedule links with a hash to the new path', () => {
    expect(
      getLegacySchedulePath({
        pathname: '/teacher',
        search: '?allow_multiple',
        hash: '#12,42',
      } as Location),
    ).toBe('/teacher/12%2C42?allow_multiple');
  });

  it('does not treat a Telegram launch hash as a schedule selection', () => {
    expect(
      getLegacySchedulePath({
        pathname: '/',
        search: '',
        hash: '#tgWebAppData=signature',
      } as Location),
    ).toBeNull();
  });

  it('normalizes repeated slashes before route matching', () => {
    expect(normalizePathname('//teacher//775')).toBe('/teacher/775');
  });
});
