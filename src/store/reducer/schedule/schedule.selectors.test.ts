import { describe, expect, it } from 'vitest';

import { reducer } from '@/store';
import {
  EMPTY_SCHEDULE_ITEMS,
  selectScheduleItems,
} from './schedule.selectors';

describe('selectScheduleItems', () => {
  const groupItems = ['ЦИСБ-24'];
  const initialState = reducer(undefined, { type: 'test' });
  const state = {
    ...initialState,
    schedule: {
      ...initialState.schedule,
      selectedItems: {
        ...initialState.schedule.selectedItems,
        group: groupItems,
      },
    },
  };

  it('returns one stable empty array when schedule type is unknown', () => {
    expect(selectScheduleItems(state, null)).toBe(EMPTY_SCHEDULE_ITEMS);
    expect(selectScheduleItems(state, null)).toBe(
      selectScheduleItems(state, null),
    );
  });

  it('returns the stored selection for a known schedule type', () => {
    expect(selectScheduleItems(state, 'group')).toBe(groupItems);
  });
});
