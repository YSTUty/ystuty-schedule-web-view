import { describe, expect, it } from 'vitest';

import {
  areSameScheduleSelections,
  limitScheduleSelections,
  MAX_SCHEDULE_SELECTIONS,
} from './ScheduleSelector.shared';

describe('ScheduleSelector.shared', () => {
  it('compares selections by order and values', () => {
    expect(areSameScheduleSelections(['a', 'b'], ['a', 'b'])).toBe(true);
    expect(areSameScheduleSelections(['a', 'b'], ['b', 'a'])).toBe(false);
  });

  it('keeps short selections unchanged', () => {
    const values = ['a', 'b'];

    expect(limitScheduleSelections(values)).toEqual(values);
    expect(limitScheduleSelections(values)).not.toBe(values);
  });

  it('keeps the first and latest items when selection reaches the limit', () => {
    const values = ['first', 'second', 'third', 'fourth'];

    expect(limitScheduleSelections(values)).toEqual([
      'first',
      'third',
      'fourth',
    ]);
    expect(MAX_SCHEDULE_SELECTIONS).toBe(3);
  });
});
