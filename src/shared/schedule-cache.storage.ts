import type { OneWeekDto } from '@/interfaces/schedule';
import type { ScheduleFor } from '@/interfaces/ystuty.types';

const DATABASE_NAME = 'ystuty-schedule-cache';
const DATABASE_VERSION = 1;
const LOOKUPS_STORE_NAME = 'lookups';
const SCHEDULES_STORE_NAME = 'schedules';

const LOOKUP_MAX_AGE = 7 * 24 * 60 * 60 * 1e3;
const SCHEDULE_MAX_AGE = 2.5 * 24 * 60 * 60 * 1e3;
const MAX_LOOKUP_ENTRIES = 10;
const MAX_SCHEDULE_ENTRIES = 50;

type CacheEntry<T> = {
  key: string;
  updatedAt: number;
  value: T;
};

let databasePromise: Promise<IDBDatabase> | undefined;

function waitForRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

function waitForTransaction(transaction: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    transaction.oncomplete = () => resolve();
    transaction.onabort = () => reject(transaction.error);
    transaction.onerror = () => reject(transaction.error);
  });
}

/**
 * Открывает отдельную IndexedDB для объёмных ответов API.
 * В отличие от LocalStorage она не блокирует UI и имеет существенно большую квоту.
 */
function getDatabase(): Promise<IDBDatabase> {
  if (!databasePromise) {
    databasePromise = new Promise<IDBDatabase>((resolve, reject) => {
      if (!window.indexedDB) {
        reject(new Error('IndexedDB is not supported'));
        return;
      }

      const request = window.indexedDB.open(DATABASE_NAME, DATABASE_VERSION);
      request.onupgradeneeded = () => {
        const database = request.result;

        if (!database.objectStoreNames.contains(LOOKUPS_STORE_NAME)) {
          const store = database.createObjectStore(LOOKUPS_STORE_NAME, {
            keyPath: 'key',
          });
          store.createIndex('updatedAt', 'updatedAt');
        }

        if (!database.objectStoreNames.contains(SCHEDULES_STORE_NAME)) {
          const store = database.createObjectStore(SCHEDULES_STORE_NAME, {
            keyPath: 'key',
          });
          store.createIndex('updatedAt', 'updatedAt');
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    }).catch((error: unknown) => {
      databasePromise = undefined;
      throw error;
    });
  }

  return databasePromise;
}

async function getEntry<T>(
  storeName: string,
  key: string,
): Promise<CacheEntry<T> | null> {
  try {
    const database = await getDatabase();
    const transaction = database.transaction(storeName, 'readonly');
    const request = transaction.objectStore(storeName).get(key);
    const entry = await waitForRequest(request);
    await waitForTransaction(transaction);

    return (entry as CacheEntry<T> | undefined) ?? null;
  } catch {
    return null;
  }
}

async function deleteExpiredEntries(
  storeName: string,
  expiresAt: number,
): Promise<void> {
  const database = await getDatabase();
  const transaction = database.transaction(storeName, 'readwrite');
  const index = transaction.objectStore(storeName).index('updatedAt');
  const request = index.openCursor(IDBKeyRange.upperBound(expiresAt));

  request.onsuccess = () => {
    const cursor = request.result;
    if (!cursor) {
      return;
    }

    cursor.delete();
    cursor.continue();
  };

  await waitForTransaction(transaction);
}

async function deleteOldestEntries(
  storeName: string,
  entriesToDelete: number,
): Promise<void> {
  if (entriesToDelete < 1) {
    return;
  }

  const database = await getDatabase();
  const transaction = database.transaction(storeName, 'readwrite');
  const index = transaction.objectStore(storeName).index('updatedAt');
  const request = index.openCursor();
  let deletedEntries = 0;

  request.onsuccess = () => {
    const cursor = request.result;
    if (!cursor || deletedEntries >= entriesToDelete) {
      return;
    }

    cursor.delete();
    deletedEntries += 1;
    cursor.continue();
  };

  await waitForTransaction(transaction);
}

/**
 * Не позволяет кэшу расти бесконечно: старые записи удаляются по TTL,
 * а затем — начиная с наиболее давно обновлённых записей.
 */
async function pruneStore(
  storeName: string,
  maxAge: number,
  maxEntries: number,
): Promise<void> {
  try {
    await deleteExpiredEntries(storeName, Date.now() - maxAge);

    const database = await getDatabase();
    const transaction = database.transaction(storeName, 'readonly');
    const entriesCount = await waitForRequest(
      transaction.objectStore(storeName).count(),
    );
    await waitForTransaction(transaction);

    await deleteOldestEntries(storeName, entriesCount - maxEntries);
  } catch {
    // Очистка кэша не должна мешать просмотру расписания.
  }
}

async function setEntry<T>(
  storeName: string,
  key: string,
  value: T,
  maxAge: number,
  maxEntries: number,
): Promise<boolean> {
  try {
    const database = await getDatabase();
    const transaction = database.transaction(storeName, 'readwrite');
    transaction.objectStore(storeName).put({
      key,
      updatedAt: Date.now(),
      value,
    } satisfies CacheEntry<T>);
    await waitForTransaction(transaction);

    void pruneStore(storeName, maxAge, maxEntries);
    return true;
  } catch {
    // IndexedDB может быть отключена, например, в приватном режиме браузера.
    return false;
  }
}

/**
 * Возвращает свежую запись небольшого справочника: групп, преподавателей
 * или аудиторий.
 */
export async function getCachedLookup<T>(key: string): Promise<T | null> {
  const entry = await getEntry<T>(LOOKUPS_STORE_NAME, key);

  if (!entry || Date.now() - entry.updatedAt > LOOKUP_MAX_AGE) {
    return null;
  }

  return entry.value;
}

/** Сохраняет справочник API в IndexedDB. */
export async function setCachedLookup<T>(
  key: string,
  value: T,
): Promise<boolean> {
  return setEntry(
    LOOKUPS_STORE_NAME,
    key,
    value,
    LOOKUP_MAX_AGE,
    MAX_LOOKUP_ENTRIES,
  );
}

function getScheduleCacheKey(
  scheduleFor: ScheduleFor,
  itemKey: string | number,
): string {
  return `${scheduleFor}:${itemKey}`;
}

/** Возвращает кэш расписания с исходным временем его получения. */
export async function getCachedSchedule(
  scheduleFor: ScheduleFor,
  itemKey: string | number,
): Promise<{ items: OneWeekDto[]; updatedAt: number } | null> {
  const entry = await getEntry<OneWeekDto[]>(
    SCHEDULES_STORE_NAME,
    getScheduleCacheKey(scheduleFor, itemKey),
  );

  if (!entry || Date.now() - entry.updatedAt > SCHEDULE_MAX_AGE) {
    return null;
  }

  return {
    items: entry.value,
    updatedAt: entry.updatedAt,
  };
}

/** Сохраняет ответ расписания без производных UI-данных. */
export async function setCachedSchedule(
  scheduleFor: ScheduleFor,
  itemKey: string | number,
  items: OneWeekDto[],
): Promise<boolean> {
  return setEntry(
    SCHEDULES_STORE_NAME,
    getScheduleCacheKey(scheduleFor, itemKey),
    items,
    SCHEDULE_MAX_AGE,
    MAX_SCHEDULE_ENTRIES,
  );
}
