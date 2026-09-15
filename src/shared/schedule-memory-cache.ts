import type { LessonData } from '@/interfaces/schedule';
import type { ScheduleFor } from '@/interfaces/ystuty.types';

export const SCHEDULE_MEMORY_CACHE_TTL = 30e3;
const MAX_CACHE_ENTRIES = 50;

export type ScheduleMemoryCacheEntry = {
  sources: LessonData[];
  time: number;
};

const cache = new Map<string, ScheduleMemoryCacheEntry>();

function isSupportedSchedule(scheduleFor: ScheduleFor): boolean {
  return scheduleFor === 'group' || scheduleFor === 'teacher';
}

function getCacheKey(
  scheduleFor: ScheduleFor,
  itemKey: string | number,
): string {
  return `${scheduleFor}:${itemKey}`;
}

function pruneCache(now: number): void {
  for (const [key, entry] of cache) {
    if (now - entry.time >= SCHEDULE_MEMORY_CACHE_TTL) {
      cache.delete(key);
    }
  }

  while (cache.size > MAX_CACHE_ENTRIES) {
    const oldestKey = cache.keys().next().value;
    if (oldestKey === undefined) {
      return;
    }

    cache.delete(oldestKey);
  }
}

/**
 * Возвращает короткоживущий кэш API-расписания. Он переживает переходы между
 * страницами, но не заменяет долговременный кэш IndexedDB.
 */
export function getMemoryCachedSchedule(
  scheduleFor: ScheduleFor,
  itemKey: string | number,
  now = Date.now(),
): ScheduleMemoryCacheEntry | null {
  if (!isSupportedSchedule(scheduleFor)) {
    return null;
  }

  const key = getCacheKey(scheduleFor, itemKey);
  const entry = cache.get(key);
  if (!entry || now - entry.time >= SCHEDULE_MEMORY_CACHE_TTL) {
    cache.delete(key);
    return null;
  }

  return entry;
}

/** Сохраняет свежий ответ API в памяти на короткое время. */
export function setMemoryCachedSchedule(
  scheduleFor: ScheduleFor,
  itemKey: string | number,
  entry: ScheduleMemoryCacheEntry,
): void {
  if (!isSupportedSchedule(scheduleFor)) {
    return;
  }

  cache.delete(getCacheKey(scheduleFor, itemKey));
  cache.set(getCacheKey(scheduleFor, itemKey), entry);
  pruneCache(entry.time);
}

/** Используется только в unit-тестах. */
export function resetScheduleMemoryCache(): void {
  cache.clear();
}
