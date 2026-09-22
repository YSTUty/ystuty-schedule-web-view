import * as React from 'react';
import { useIntl } from 'react-intl';
import { useNetworkState } from 'react-use';
import store2 from 'store2';

import { useApi } from '@/shared/api.hook';
import {
  getCachedLookup,
  setCachedLookup,
} from '@/shared/schedule-cache.storage';
import {
  getMemoryCachedLookup,
  setMemoryCachedLookup,
} from '@/shared/schedule-lookup-memory-cache';
import { useDispatch } from '@/store';
import alertSlice from '@/store/reducer/alert/alert.slice';

export type ScheduleLookupResponse<T> = {
  items: T[];
  isCache?: boolean;
};

/**
 * Описание справочника расписания. Хук скрывает за этим интерфейсом загрузку,
 * кэш в памяти/IndexedDB и временную миграцию старого LocalStorage-кэша.
 */
export type ScheduleLookupConfig<
  T,
  TResponse extends ScheduleLookupResponse<T> = ScheduleLookupResponse<T>,
> = {
  apiPath: string;
  cacheKey: string;
  cachedMessage: string;
  legacyStorageKey?: string;
  writeLegacyCacheOnApiSuccess?: boolean;
  normalizeItems?: (items: T[]) => T[];
  getItems?: (response: TResponse) => T[];
  isServerCached?: (response: TResponse) => boolean;
};

type ScheduleLookupState<T> = {
  items: T[];
  isCached: boolean;
  isServerCached: boolean;
  refresh: (forceRefresh?: boolean) => Promise<void>;
};

function getLegacyLookup<T>(legacyStorageKey?: string): T[] | null {
  if (!legacyStorageKey) {
    return null;
  }

  return store2.get(legacyStorageKey, null) as T[] | null;
}

function normalizeLookupItems<T, TResponse extends ScheduleLookupResponse<T>>(
  config: ScheduleLookupConfig<T, TResponse>,
  items: T[],
): T[] {
  return config.normalizeItems ? config.normalizeItems([...items]) : items;
}

/**
 * Возвращает синхронно доступный снимок справочника для мест, где React-hook
 * использовать нельзя (например, при построении ресурсов календаря).
 */
export function getScheduleLookupSnapshot<
  T,
  TResponse extends ScheduleLookupResponse<T> = ScheduleLookupResponse<T>,
>(config: ScheduleLookupConfig<T, TResponse>): T[] | null {
  return (
    getMemoryCachedLookup<T[]>(config.cacheKey) ??
    getLegacyLookup<T>(config.legacyStorageKey)
  );
}

/**
 * Загружает справочник расписания с единым поведением:
 * memory cache → API → IndexedDB/legacy cache при ошибке или офлайне.
 */
export function useScheduleLookup<
  T,
  TResponse extends ScheduleLookupResponse<T> = ScheduleLookupResponse<T>,
>(config: ScheduleLookupConfig<T, TResponse>): ScheduleLookupState<T> {
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const { online, previous: previousOnline } = useNetworkState();
  const [fetchApi] = useApi();
  const fetchApiRef = React.useRef(fetchApi);
  const memoryCachedItems = getMemoryCachedLookup<T[]>(config.cacheKey);
  const [items, setItems] = React.useState<T[]>(() => memoryCachedItems ?? []);
  const [isCached, setIsCached] = React.useState(memoryCachedItems !== null);
  const [isServerCached, setIsServerCached] = React.useState(false);

  fetchApiRef.current = fetchApi;

  const applyItems = React.useCallback(
    (
      nextItems: T[],
      options: { isCached?: boolean; isServerCached?: boolean } = {},
    ) => {
      setItems(normalizeLookupItems(config, nextItems));
      setIsCached(options.isCached ?? false);
      setIsServerCached(options.isServerCached ?? false);
    },
    [config],
  );

  const notifyCachedItems = React.useCallback(() => {
    dispatch(
      alertSlice.actions.add({
        message: config.cachedMessage,
        severity: 'warning',
      }),
    );
  }, [config.cachedMessage, dispatch]);

  /** Временно читает legacy-кэш, пока данные не будут перенесены в IndexedDB. */
  const restoreCachedItems = React.useCallback(async () => {
    const cachedItems = await getCachedLookup<T[]>(config.cacheKey);
    if (cachedItems) {
      applyItems(cachedItems, { isCached: true });
      setMemoryCachedLookup(config.cacheKey, cachedItems);
      return true;
    }

    const legacyItems = getLegacyLookup<T>(config.legacyStorageKey);
    if (!legacyItems) {
      return false;
    }

    applyItems(legacyItems, { isCached: true });
    setMemoryCachedLookup(config.cacheKey, legacyItems);

    if (
      config.legacyStorageKey &&
      (await setCachedLookup(config.cacheKey, legacyItems))
    ) {
      store2.remove(config.legacyStorageKey);
    }

    return true;
  }, [applyItems, config.cacheKey, config.legacyStorageKey]);

  const refresh = React.useCallback(
    async (forceRefresh = false) => {
      const memoryCached =
        !forceRefresh && getMemoryCachedLookup<T[]>(config.cacheKey);
      if (memoryCached) {
        applyItems(memoryCached, { isCached: true });
        return;
      }

      if (!online) {
        if (await restoreCachedItems()) {
          notifyCachedItems();
        }
        return;
      }

      try {
        const response = await fetchApiRef.current<TResponse>(
          config.apiPath,
          {},
          {
            setError: (message, options) =>
              dispatch(
                alertSlice.actions.add({
                  message: `Error: ${message}`,
                  severity: 'warning',
                  toastAutoClose: options?.toastAutoClose,
                }),
              ),
          },
        );

        // `null` означает отменённый или уже заблокированный запрос. Например,
        // это происходит при проверочном размонтировании React.StrictMode.
        if (!response || 'error' in response || !('data' in response)) {
          if (response && 'error' in response && (await restoreCachedItems())) {
            notifyCachedItems();
          }
          return;
        }

        const responseData = response.data;
        const responseItems = config.getItems
          ? config.getItems(responseData)
          : responseData.items;
        const serverCached = config.isServerCached
          ? config.isServerCached(responseData)
          : responseData.isCache === true;

        applyItems(responseItems, {
          // Серверный кэш тоже отмечаем как кэш в интерфейсе. Так сохраняется
          // прежняя маркировка «кэш*», где звёздочка поясняет источник данных.
          isCached: serverCached,
          isServerCached: serverCached,
        });
        setMemoryCachedLookup(config.cacheKey, responseItems);

        if (config.writeLegacyCacheOnApiSuccess && config.legacyStorageKey) {
          store2.set(config.legacyStorageKey, responseItems);
        }

        void setCachedLookup(config.cacheKey, responseItems).then(
          (isStored) => {
            if (isStored && config.legacyStorageKey) {
              store2.remove(config.legacyStorageKey);
            }
          },
        );
      } catch (error) {
        if (await restoreCachedItems()) {
          notifyCachedItems();
        } else if (online) {
          dispatch(
            alertSlice.actions.add({
              message: `Error: ${(error as Error).message}`,
              severity: 'error',
            }),
          );
        } else {
          dispatch(
            alertSlice.actions.add({
              message: formatMessage({ id: 't.api.offline.error' }),
              severity: 'warning',
            }),
          );
        }
      }
    },
    [
      applyItems,
      config,
      dispatch,
      formatMessage,
      notifyCachedItems,
      online,
      restoreCachedItems,
    ],
  );

  React.useEffect(() => {
    const isNetworkRestored = previousOnline === false && online === true;
    void refresh(isNetworkRestored);
  }, [online, previousOnline, refresh]);

  return {
    items,
    isCached,
    isServerCached,
    refresh,
  };
}
