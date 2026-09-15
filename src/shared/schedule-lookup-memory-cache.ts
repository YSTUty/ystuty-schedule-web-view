export const SCHEDULE_LOOKUP_MEMORY_CACHE_TTL = 2 * 60e3;
const MAX_CACHE_ENTRIES = 10;

type LookupMemoryCacheEntry<T> = {
  updatedAt: number;
  value: T;
};

const cache = new Map<string, LookupMemoryCacheEntry<unknown>>();

function pruneCache(now: number): void {
  for (const [key, entry] of cache) {
    if (now - entry.updatedAt >= SCHEDULE_LOOKUP_MEMORY_CACHE_TTL) {
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
 * Короткоживущий кэш справочников для переходов между страницами в одной
 * сессии. После полной перезагрузки источником остаётся API и IndexedDB.
 */
export function getMemoryCachedLookup<T>(
  key: string,
  now = Date.now(),
): T | null {
  const entry = cache.get(key) as LookupMemoryCacheEntry<T> | undefined;
  if (!entry || now - entry.updatedAt >= SCHEDULE_LOOKUP_MEMORY_CACHE_TTL) {
    cache.delete(key);
    return null;
  }

  return entry.value;
}

/** Запоминает справочник после загрузки из API или persistent-кэша. */
export function setMemoryCachedLookup<T>(key: string, value: T): void {
  const now = Date.now();

  cache.delete(key);
  cache.set(key, { updatedAt: now, value });
  pruneCache(now);
}

/** Используется только в unit-тестах. */
export function resetScheduleLookupMemoryCache(): void {
  cache.clear();
}
