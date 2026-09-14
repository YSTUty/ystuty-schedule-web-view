import { describe, expect, it } from 'vitest';

import {
  filterByAcademicPeriod,
  getAcademicPeriodForDate,
  getAvailableAcademicPeriods,
  getDefaultAcademicPeriodId,
} from './academic-period.utils';

describe('academic-period.utils', () => {
  it.each([
    ['2026-01-20T12:00:00', '2025-autumn'],
    ['2026-02-01T12:00:00', '2026-spring'],
    ['2026-06-30T12:00:00', '2026-spring'],
    ['2026-07-01T12:00:00', '2026-spring'],
    ['2026-09-01T12:00:00', '2026-autumn'],
  ])('assigns %s to %s', (date, expectedPeriodId) => {
    expect(getAcademicPeriodForDate(date)?.id).toBe(expectedPeriodId);
  });

  it('returns available periods from newest to oldest', () => {
    const periods = getAvailableAcademicPeriods([
      { startAt: '2025-10-01T12:00:00' },
      { startAt: '2026-03-01T12:00:00' },
      { startAt: '2026-09-01T12:00:00' },
      { startAt: 'not-a-date' },
    ]);

    expect(periods.map((period) => period.id)).toEqual([
      '2026-autumn',
      '2026-spring',
      '2025-autumn',
    ]);
  });

  it('prefers the current period and falls back to the latest available one', () => {
    const periods = getAvailableAcademicPeriods([
      { startAt: '2025-10-01T12:00:00' },
      { startAt: '2026-03-01T12:00:00' },
    ]);

    expect(getDefaultAcademicPeriodId(periods, '2026-04-10T12:00:00')).toBe(
      '2026-spring',
    );
    expect(getDefaultAcademicPeriodId(periods, '2026-09-10T12:00:00')).toBe(
      '2026-spring',
    );
  });

  it('filters lessons by the selected period', () => {
    const lessons = [
      { id: 1, startAt: '2025-10-01T12:00:00' },
      { id: 2, startAt: '2026-03-01T12:00:00' },
      { id: 3, startAt: 'not-a-date' },
    ];

    expect(filterByAcademicPeriod(lessons, '2025-autumn')).toEqual([
      lessons[0],
    ]);
  });
});
