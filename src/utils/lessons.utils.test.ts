import { describe, expect, it } from 'vitest';

import { LessonFlags } from '@/interfaces/schedule';
import { getLessonPairCount, getLessonTypeStrArr } from './lessons.utils';

describe('getLessonTypeStrArr', () => {
  it.each([
    [LessonFlags.Practice, 'Практика'],
    [LessonFlags.Event, 'Событие'],
    [LessonFlags.MilitaryTraining, 'ВУЦ'],
    [LessonFlags.PhysicalTraining, 'Физ. культура'],
    [LessonFlags.Elective, 'Факультатив'],
    [LessonFlags.External, 'Внешнее занятие'],
    [LessonFlags.Tenzor, 'Тензор'],
    [LessonFlags.School21, 'Школа 21'],
  ])('formats the %s flag', (type, expectedName) => {
    expect(getLessonTypeStrArr(type)).toEqual([expectedName]);
  });

  it('formats a combination of lesson flags', () => {
    expect(
      getLessonTypeStrArr(LessonFlags.Event | LessonFlags.External),
    ).toEqual(['Событие', 'Внешнее занятие']);
  });

  it('formats the empty lesson type explicitly', () => {
    expect(getLessonTypeStrArr(LessonFlags.None)).toEqual(['???']);
  });

  it('does not treat unknown flags as an empty lesson type', () => {
    expect(getLessonTypeStrArr(1 as LessonFlags)).toEqual([]);
  });
});

describe('getLessonPairCount', () => {
  it('converts academic hours into pairs', () => {
    expect(getLessonPairCount(4)).toBe(2);
    expect(getLessonPairCount(1)).toBe(0.5);
  });

  it('counts a lesson without a valid duration as one pair', () => {
    expect(getLessonPairCount(null)).toBe(1);
    expect(getLessonPairCount(undefined)).toBe(1);
    expect(getLessonPairCount(0)).toBe(1);
    expect(getLessonPairCount(Number.NaN)).toBe(1);
  });
});
