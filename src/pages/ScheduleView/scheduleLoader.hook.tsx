import React from 'react';
import { useDebounce } from 'react-use';
import store2 from 'store2';

import { LessonData, LessonFlags, OneWeekDto } from '@/interfaces/schedule';
import { ITeacherData, ScheduleFor } from '@/interfaces/ystuty.types';
import { useApi } from '@/shared/api.hook';
import {
  getCachedSchedule,
  setCachedSchedule,
} from '@/shared/schedule-cache.storage';
import { notifyTelegramResult } from '@/shared/telegram/telegram.sdk';
import { useDispatch, useSelector } from '@/store';
import alertSlice from '@/store/reducer/alert/alert.slice';
import scheduleSlice from '@/store/reducer/schedule/schedule.slice';

export const useScheduleLoader = (props: {
  scheduleFor: ScheduleFor | null;
}) => {
  const { scheduleFor } = props;

  const STORE_CACHED_OLD_KEYS = React.useMemo(
    () =>
      scheduleFor === 'group'
        ? ['CACHED_GROUP::', 'CACHED_V2_GROUP::']
        : scheduleFor === 'teacher'
          ? ['CACHED_TEACHER_LESSONS::', 'CACHED_V2_TEACHER_LESSONS::']
          : scheduleFor === 'audience'
            ? []
            : [],
    [scheduleFor],
  );
  const STORE_CACHED_KEY =
    scheduleFor === 'group'
      ? 'CACHED_V3_GROUP::'
      : scheduleFor === 'teacher'
        ? 'CACHED_V3_TEACHER_LESSONS::'
        : scheduleFor === 'audience'
          ? 'CACHED_V1_AUDIENCE::'
          : null;

  // const { online } = useNetworkState();
  const dispatch = useDispatch();
  const selectedItemsState = useSelector((state) =>
    !scheduleFor ? [] : state.schedule.selectedItems[scheduleFor],
  );
  const selectedItems: (string | number)[] = Array.isArray(selectedItemsState)
    ? selectedItemsState
    : [];

  const [fetchApi, isFetching, isFetchings, abortControllers] = useApi();
  const [isCached, setIsCached] = React.useState(false);

  const [schedulesData, setSchedulesData] =
    React.useState<Record<string, { time: number; sources: LessonData[] }>>();

  const formatData = React.useCallback(
    (itemKey: string | number, items: OneWeekDto[], loadedAt = Date.now()) => {
      const sources = items.reduce<LessonData[]>(
        (prev, week) => [
          ...prev,
          ...week.days.flatMap((day) =>
            day.lessons.map(
              (lesson) =>
                ({
                  ...lesson,
                  start: lesson.startAt!,
                  end: lesson.endAt!,
                  title: lesson.lessonName || '...',
                  typeArr: (Object.values(LessonFlags) as LessonFlags[]).filter(
                    (e) => (lesson.type & e) === e && e !== LessonFlags.None,
                  ),
                }) as LessonData,
            ),
          ),
        ],
        [],
      );

      setSchedulesData((state) => ({
        ...state,
        [itemKey]: {
          time: loadedAt,
          sources,
        },
      }));
    },
    [setSchedulesData],
  );

  /**
   * Временно поддерживает прежний кэш в LocalStorage, перенося его в IndexedDB
   * при первом востребованном расписании.
   */
  const loadCachedSchedule = React.useCallback(
    async (itemKey: string | number) => {
      if (!scheduleFor) {
        return false;
      }

      const cachedSchedule = await getCachedSchedule(scheduleFor, itemKey);
      if (cachedSchedule) {
        formatData(itemKey, cachedSchedule.items, cachedSchedule.updatedAt);
        setIsCached(true);
        return true;
      }

      const legacyCacheKey = STORE_CACHED_KEY && STORE_CACHED_KEY + itemKey;
      const legacySchedule = legacyCacheKey
        ? (store2.get(legacyCacheKey, null) as {
            items?: OneWeekDto[];
            time?: number;
          } | null)
        : null;
      if (!legacySchedule?.items) {
        return false;
      }

      formatData(itemKey, legacySchedule.items, legacySchedule.time);
      setIsCached(true);

      if (await setCachedSchedule(scheduleFor, itemKey, legacySchedule.items)) {
        store2.remove(legacyCacheKey);
      }

      return true;
    },
    [formatData, scheduleFor, STORE_CACHED_KEY],
  );

  const loadSchedule = React.useCallback(
    async (itemKey: string | number) => {
      if (
        schedulesData?.[itemKey] &&
        Date.now() - schedulesData[itemKey].time < 30e3
      ) {
        return;
      }

      if (isFetchings[itemKey] || !scheduleFor) {
        return;
      }

      try {
        const response = await fetchApi<{
          isCache: boolean;
          items: OneWeekDto[];
          teacher?: ITeacherData;
        }>(
          `v1/schedule/${scheduleFor}/${itemKey}`,
          {},
          {
            fKey: `${scheduleFor}/${itemKey}`,
            setError: (error) =>
              dispatch(
                alertSlice.actions.add({
                  message: `Error: ${error}`,
                  severity: 'error',
                }),
              ),
          },
        );

        if (!response || 'error' in response || !('data' in response)) {
          await loadCachedSchedule(itemKey);
          return;
        }

        formatData(itemKey, response.data.items);
        setIsCached(false);
        void setCachedSchedule(scheduleFor, itemKey, response.data.items);
        notifyTelegramResult('success');
      } catch (err) {
        // ??
        const isCacheRestored = await loadCachedSchedule(itemKey);
        if (!isCacheRestored) {
          dispatch(
            alertSlice.actions.add({
              message: 'Ошибка загрузки актуального расписания',
              severity: 'warning',
            }),
          );
          notifyTelegramResult('warning');
        }
        // if (online) {
        //     dispatch(
        //         alertSlice.actions.add({
        //             message: `Error: ${(err as Error).message}`,
        //             severity: 'error',
        //         }),
        //     );
        // }
      }
    },
    [
      isFetchings,
      scheduleFor,
      schedulesData,
      formatData,
      loadCachedSchedule /* online */,
    ],
  );

  useDebounce(
    () => {
      for (const val of selectedItems) {
        loadSchedule(val);
      }
      return () => {
        for (const abortController of Object.values(abortControllers.current)) {
          abortController.abort();
        }
      };
    },
    500,
    [selectedItems],
  );

  const scheduleData = React.useMemo(
    () =>
      selectedItems
        .map((itemKey) => ({
          itemKey,
          data: schedulesData?.[itemKey]?.sources!,
        }))
        .filter((e) => !!e.data),
    [selectedItems, schedulesData],
  );

  React.useEffect(() => {
    if (scheduleFor) {
      dispatch(
        scheduleSlice.actions.setScheduleData({
          scheduleFor,
          items: scheduleData,
        }),
      );
    }
  }, [scheduleFor, scheduleData]);

  React.useEffect(() => {
    dispatch(scheduleSlice.actions.setFetchingSchedule(isFetching));
  }, [isFetching]);

  /** Переносит старые объёмные записи из LocalStorage и освобождает его квоту. */
  React.useEffect(() => {
    if (!scheduleFor || !STORE_CACHED_KEY) {
      return;
    }

    const legacyKeys = Array.from({ length: localStorage.length }, (_, index) =>
      localStorage.key(index),
    ).filter((key): key is string => key !== null);

    void Promise.all(
      legacyKeys.map(async (key) => {
        if (STORE_CACHED_OLD_KEYS.some((prefix) => key.startsWith(prefix))) {
          localStorage.removeItem(key);
          return;
        }

        if (!key.startsWith(STORE_CACHED_KEY)) {
          return;
        }

        const itemKey = key.slice(STORE_CACHED_KEY.length);
        const legacySchedule = store2.get(key, null) as {
          items?: OneWeekDto[];
          time?: number;
        } | null;
        if (
          !legacySchedule?.items ||
          !legacySchedule.time ||
          Date.now() - legacySchedule.time > 2.5 * 24 * 60 * 60 * 1e3
        ) {
          localStorage.removeItem(key);
          return;
        }

        if (
          await setCachedSchedule(scheduleFor, itemKey, legacySchedule.items)
        ) {
          localStorage.removeItem(key);
        }
      }),
    );
  }, [scheduleFor, STORE_CACHED_KEY, STORE_CACHED_OLD_KEYS]);

  return [scheduleData, isFetching, isCached] as const;
};
