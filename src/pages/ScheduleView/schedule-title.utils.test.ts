import { describe, expect, it } from 'vitest';

import { getScheduleLessonTitle } from './schedule-title.utils';

describe('getScheduleLessonTitle', () => {
  it('prefers the lesson name', () => {
    expect(getScheduleLessonTitle('Математика', 'Экзамен')).toBe('Математика');
  });

  it('uses subInfo when the lesson name is missing', () => {
    expect(getScheduleLessonTitle(null, 'Экзамен')).toBe('Экзамен');
  });

  it('keeps the placeholder when neither value is available', () => {
    expect(getScheduleLessonTitle()).toBe('...');
  });
});
