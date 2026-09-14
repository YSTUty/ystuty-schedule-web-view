import { describe, expect, it } from 'vitest';

import { getLessonPairCount } from './lessons.utils';

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
