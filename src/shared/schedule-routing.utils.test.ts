import { describe, expect, it } from 'vitest';

import {
  buildSchedulePath,
  getLegacySchedulePath,
  getScheduleSelectionFromPathname,
  getTeacherSelectionPathRoute,
  normalizePathname,
  teacherLessonsSelectionRoute,
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

  it('stores a teacher lessons selection in the path', () => {
    const path = teacherLessonsSelectionRoute.buildPath(['2334', '42']);

    expect(path).toBe('/teacher-lessons/2334%2C42');
    expect(teacherLessonsSelectionRoute.getSelectionFromPathname(path)).toEqual(
      ['2334', '42'],
    );
  });

  it('uses the teacher lessons route only on the custom page', () => {
    expect(
      getTeacherSelectionPathRoute('/teacher-lessons/2334').buildPath(['42']),
    ).toBe('/teacher-lessons/42');
    expect(
      getTeacherSelectionPathRoute('/teacher/2334').buildPath(['42']),
    ).toBe('/teacher/42');
  });

  it('redirects a legacy teacher lessons hash to the path', () => {
    expect(
      getLegacySchedulePath({
        pathname: '/teacher-lessons',
        search: '',
        hash: '#2334',
      } as Location),
    ).toBe('/teacher-lessons/2334');
  });

  it('normalizes repeated slashes before route matching', () => {
    expect(normalizePathname('//teacher//775')).toBe('/teacher/775');
  });
});
