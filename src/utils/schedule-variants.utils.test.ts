import { describe, expect, it } from 'vitest';

import { LessonData, LessonFlags, WeekParityType } from '@/interfaces/schedule';
import { mergeMassLessonVariants } from './schedule-variants.utils';

const createLesson = (overrides: Partial<LessonData> = {}): LessonData => ({
  additionalAuditoryName: undefined,
  additionalTeacherName: undefined,
  duration: 2,
  durationMinutes: 90,
  end: '2026-09-16T14:10:00.000Z',
  endAt: '2026-09-16T14:10:00.000Z',
  groups: ['ЦИСБ-24'],
  isDivision: true,
  isDistant: false,
  isStream: false,
  lessonName: 'Научно-исследовательский семинар',
  number: 4,
  originalTimeTitle: '4. 12:40-14:10',
  parity: WeekParityType.CUSTOM,
  start: '2026-09-16T12:40:00.000Z',
  startAt: '2026-09-16T12:40:00.000Z',
  teacherName: 'Иванов Иван Иванович',
  timeRange: '12:40-14:10',
  title: 'Научно-исследовательский семинар',
  type: LessonFlags.Practical,
  typeArr: [LessonFlags.Practical],
  auditoryName: 'Точка кипения',
  ...overrides,
});

describe('schedule-variants.utils', () => {
  it('merges four adjacent subgroup variants and preserves their details', () => {
    const lessons = [
      createLesson({
        groups: ['ЦИСБ-24-1'],
        isDivision: false,
        teacherName: 'Иванов Иван Иванович',
      }),
      createLesson({
        groups: ['ЦИСБ-24-2'],
        isDivision: false,
        teacherName: 'Петров Пётр Петрович',
      }),
      createLesson({
        groups: ['ЦИСБ-24-3'],
        isDivision: false,
        teacherName: 'Сидоров Сидор Сидорович',
      }),
      createLesson({
        additionalTeacherName: 'Кузнецов Кузьма Кузьмич',
        groups: ['ЦИСБ-24-4'],
        isDivision: false,
        teacherName: 'Фёдоров Фёдор Фёдорович',
      }),
    ];

    expect(mergeMassLessonVariants(lessons)).toEqual([
      expect.objectContaining({
        groups: ['ЦИСБ-24-1', 'ЦИСБ-24-2', 'ЦИСБ-24-3', 'ЦИСБ-24-4'],
        isDivision: true,
        mergedTeacherNames: [
          'Иванов Иван Иванович',
          'Петров Пётр Петрович',
          'Сидоров Сидор Сидорович',
          'Фёдоров Фёдор Фёдорович',
          'Кузнецов Кузьма Кузьмич',
        ],
        mergedVariantsCount: 4,
      }),
    ]);
  });

  it('keeps two or three variants as separate appointments', () => {
    const lessons = [
      createLesson(),
      createLesson({ teacherName: 'Петров Пётр Петрович' }),
      createLesson({ teacherName: 'Сидоров Сидор Сидорович' }),
    ];

    expect(mergeMassLessonVariants(lessons)).toEqual(lessons);
  });

  it('does not merge adjacent lessons with different subjects, rooms or format', () => {
    const lessons = [
      createLesson(),
      createLesson({ teacherName: 'Петров Пётр Петрович' }),
      createLesson({ teacherName: 'Сидоров Сидор Сидорович' }),
      createLesson({
        lessonName: 'Другая дисциплина',
        teacherName: 'Фёдоров Фёдор Фёдорович',
        title: 'Другая дисциплина',
      }),
      createLesson({
        auditoryName: 'Г-626',
        teacherName: 'Кузнецов Кузьма Кузьмич',
      }),
      createLesson({
        isDistant: true,
        teacherName: 'Орлов Олег Олегович',
      }),
    ];

    expect(mergeMassLessonVariants(lessons)).toEqual(lessons);
  });
});
