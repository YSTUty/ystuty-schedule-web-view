import { afterEach, describe, expect, it } from 'vitest';

import {
  getMemoryCachedSchedule,
  resetScheduleMemoryCache,
  setMemoryCachedSchedule,
} from './schedule-memory-cache';

describe('schedule-memory-cache', () => {
  afterEach(() => {
    resetScheduleMemoryCache();
  });

  it('keeps group and teacher schedules for thirty seconds', () => {
    const entry = { sources: [], time: 1_000 };

    setMemoryCachedSchedule('group', 'ЦИСБ-24', entry);
    setMemoryCachedSchedule('teacher', 2334, entry);

    expect(getMemoryCachedSchedule('group', 'ЦИСБ-24', 30_999)).toBe(entry);
    expect(getMemoryCachedSchedule('teacher', 2334, 30_999)).toBe(entry);
  });

  it('does not reuse expired or audience schedules', () => {
    const entry = { sources: [], time: 1_000 };

    setMemoryCachedSchedule('group', 'ЦИСБ-24', entry);
    setMemoryCachedSchedule('audience', 626, entry);

    expect(getMemoryCachedSchedule('group', 'ЦИСБ-24', 31_000)).toBeNull();
    expect(getMemoryCachedSchedule('audience', 626, 1_001)).toBeNull();
  });
});
