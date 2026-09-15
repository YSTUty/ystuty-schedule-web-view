import React from 'react';
import { useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router';
import { useNetworkState } from 'react-use';
import store2 from 'store2';
import classNames from 'clsx';

import TextField from '@mui/material/TextField';

import {
  AllowMultipleRef,
  areSameScheduleSelections,
  limitScheduleSelections,
  ScheduleSelectorPopper,
  shouldIgnoreAutocompleteRemoval,
} from '@components/ScheduleSelector.shared';
import { ITeacherData } from '@/interfaces/ystuty.types';
import { useApi } from '@/shared/api.hook';
import {
  getCachedLookup,
  setCachedLookup,
} from '@/shared/schedule-cache.storage';
import {
  getMemoryCachedLookup,
  setMemoryCachedLookup,
} from '@/shared/schedule-lookup-memory-cache';
import { getTeacherSelectionPathRoute } from '@/shared/schedule-routing.utils';
import { notifyTelegramSelectionChanged } from '@/shared/telegram/telegram.sdk';
import { useDispatch, useSelector } from '@/store';
import alertSlice from '@/store/reducer/alert/alert.slice';
import scheduleSlice, {
  getLastTeachers,
  STORE_TEACHER_NAME_KEY,
} from '@/store/reducer/schedule/schedule.slice';
import { StyledAutocomplete } from './StylePulseAnimation.component';

// const STORE_CACHED_TEACHERS_KEY_OLD = 'cachedTeachers';
const STORE_CACHED_TEACHERS_KEY = 'CACHED_V3_TEACHERS::';
const TEACHERS_CACHE_KEY = 'actual-teachers';

export const getTeachers = () =>
  getMemoryCachedLookup<ITeacherData[]>(TEACHERS_CACHE_KEY) ??
  (store2.get(STORE_CACHED_TEACHERS_KEY, null) as ITeacherData[] | null);

export const SelectTeacherComponent = (props: {
  allowMultipleRef: AllowMultipleRef;
}) => {
  const { allowMultipleRef } = props;
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const { fetchingSchedule } = useSelector((state) => state.schedule);
  const allowedMultiple = useSelector(
    (state) => state.schedule.allowedMultiple.teacher,
  );
  const selected = useSelector(
    (state) => state.schedule.selectedItems.teacher,
  ) as number[];
  const { online, previous: previousOnline } = useNetworkState();

  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();

  const [teachers, setTeachers] = React.useState<ITeacherData[]>(
    () => getMemoryCachedLookup<ITeacherData[]>(TEACHERS_CACHE_KEY) ?? [],
  );
  const [fetchApi, isFetching] = useApi();
  const [isCached, setIsCached] = React.useState(false);

  const defaultValues: number[] = React.useMemo(() => {
    const teacherIds = getLastTeachers();
    const selectedTeacherIds =
      getTeacherSelectionPathRoute(pathname).getSelectionFromPathname(pathname);
    let values = selectedTeacherIds
      .map<number>((teacherId) => Number(teacherId))
      .filter((teacherId) => teacherId > 0);
    values = values.length > 0 ? values : teacherIds;
    return values;
  }, [pathname]);

  const applyTeachers = React.useCallback(
    (items: ITeacherData[] | null, isCache = false) => {
      if (!items) {
        return;
      }

      if (items.length > 0) {
        setIsCached(isCache);
      }

      if (!isCache && items.length > 0) {
        store2.set(STORE_CACHED_TEACHERS_KEY, items);
      }

      // items.sort();
      setTeachers(items);
    },
    [setTeachers, setIsCached],
  );

  const loadCachedTeachers = React.useCallback(async () => {
    const cachedItems =
      await getCachedLookup<ITeacherData[]>(TEACHERS_CACHE_KEY);
    if (cachedItems) {
      applyTeachers(cachedItems, true);
      setMemoryCachedLookup(TEACHERS_CACHE_KEY, cachedItems);
      return true;
    }

    const legacyItems = store2.get(STORE_CACHED_TEACHERS_KEY, null) as
      | ITeacherData[]
      | null;
    if (!legacyItems) {
      return false;
    }

    applyTeachers(legacyItems, true);
    setMemoryCachedLookup(TEACHERS_CACHE_KEY, legacyItems);
    if (await setCachedLookup(TEACHERS_CACHE_KEY, legacyItems)) {
      store2.remove(STORE_CACHED_TEACHERS_KEY);
    }
    return true;
  }, [applyTeachers]);

  const notifyCachedTeachers = React.useCallback(() => {
    dispatch(
      alertSlice.actions.add({
        message: 'Используется сохранённый список преподавателей.',
        severity: 'warning',
      }),
    );
  }, [dispatch]);

  const loadTeachersList = React.useCallback(
    async (forceRefresh = false) => {
      if (isFetching) return;

      const memoryCachedItems =
        !forceRefresh &&
        getMemoryCachedLookup<ITeacherData[]>(TEACHERS_CACHE_KEY);
      if (memoryCachedItems) {
        applyTeachers(memoryCachedItems);
        return;
      }

      if (!online) {
        if (await loadCachedTeachers()) {
          notifyCachedTeachers();
        }
        return;
      }

      try {
        const response = await fetchApi<{ items: ITeacherData[] }>(
          `v1/schedule/actual_teachers`,
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

        if (!response || 'error' in response || !('data' in response)) {
          if (await loadCachedTeachers()) {
            notifyCachedTeachers();
          }
          return;
        }
        applyTeachers(response.data.items);
        setMemoryCachedLookup(TEACHERS_CACHE_KEY, response.data.items);
        void setCachedLookup(TEACHERS_CACHE_KEY, response.data.items).then(
          (isStored) => {
            if (isStored) {
              store2.remove(STORE_CACHED_TEACHERS_KEY);
            }
          },
        );
      } catch (err) {
        // При недоступности API сохраняем возможность выбрать преподавателя
        // из последнего успешно сохранённого справочника.
        const isCacheRestored = await loadCachedTeachers();
        if (isCacheRestored) {
          notifyCachedTeachers();
        } else if (online) {
          dispatch(
            alertSlice.actions.add({
              message: `Error: ${(err as Error).message}`,
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
    [applyTeachers, loadCachedTeachers, notifyCachedTeachers, online],
  );

  const onChangeValues = React.useCallback(
    (value: number | number[] | null) => {
      value = !value ? [] : Array.isArray(value) ? value : [value];
      value = value.filter(Boolean);
      const values = limitScheduleSelections(value.filter(Boolean));

      if (
        values.length !== selected.length ||
        values.some((e, i) => selected[i] !== e)
      ) {
        notifyTelegramSelectionChanged();
        dispatch(
          scheduleSlice.actions.setSelectedItems({
            scheduleFor: 'teacher',
            items: values,
          }),
        );
        if (values.length > 0) {
          navigate({
            pathname: getTeacherSelectionPathRoute(pathname).buildPath(values),
            search,
            hash,
          });
          store2.set(STORE_TEACHER_NAME_KEY, values);
        }
      }
    },
    [dispatch, hash, navigate, pathname, search, selected],
  );

  const fixSelected = React.useCallback(
    (newSelected: number[] = selected) => {
      let value = newSelected;
      if (teachers.length > 1) {
        value = teachers
          .map((teacher) =>
            newSelected.find((selected) => teacher.id === selected),
          )
          .filter(Boolean) as number[];
      }
      if (value.length > 0) {
        onChangeValues(value);
      }
    },
    [teachers, selected, onChangeValues],
  );

  const allowMultiple = React.useCallback(
    (state = true) => {
      dispatch(
        scheduleSlice.actions.setAllowedMultiple({
          scheduleFor: 'teacher',
          allowed: state,
        }),
      );
      if (!state) {
        const [value] = selected;
        onChangeValues(value);
      } else {
        onChangeValues(selected);
      }
    },
    [onChangeValues, selected],
  );

  // Check correct names after teachers loading
  React.useEffect(() => {
    if (teachers.length > 1) {
      fixSelected();
    }
  }, [teachers]);

  // Синхронизируем выбор с URL при переходах по ссылкам и кнопкам браузера.
  React.useEffect(() => {
    if (!areSameScheduleSelections(defaultValues, selected)) {
      fixSelected(defaultValues);
    }
  }, [defaultValues]);

  React.useEffect(() => {
    const isNetworkRestored = previousOnline === false && online === true;
    void loadTeachersList(isNetworkRestored);
  }, [online, previousOnline]);

  React.useEffect(() => {
    allowMultipleRef.current = allowMultiple;
  }, [allowMultiple]);

  React.useEffect(() => {
    fixSelected(defaultValues);

    if (window.location.search.includes('allow_multiple')) {
      allowMultiple();
    }
  }, []);

  const isMultiple = allowedMultiple || selected.length > 1;
  const value = isMultiple
    ? teachers.length > 0
      ? selected
      : []
    : teachers.length > 0
      ? selected[0]
      : null;

  return (
    <StyledAutocomplete
      className={classNames({
        ['pulsation']: !value,
      })}
      multiple={isMultiple}
      sx={{ minWidth: 200, width: '100%' }}
      size="small"
      options={teachers.map((e) => e.id)}
      disableCloseOnSelect={isMultiple}
      disableListWrap
      getOptionLabel={(option) =>
        teachers.find((e) => option === e.id)?.name || 'NoName'
      }
      // groupBy={(option) => options[option]}
      renderInput={(params) => (
        <TextField
          {...params}
          label={`Преподавател${isMultiple ? 'и' : 'ь'}${isCached ? '*' : ''}`}
          placeholder={((e) =>
            (e.length > 0 && e[Math.floor(Math.random() * e.length)].name) ||
            '...')(teachers)}
        />
      )}
      slots={{ popper: ScheduleSelectorPopper }}
      value={value}
      onChange={(event, newValue, reason) => {
        if (shouldIgnoreAutocompleteRemoval(event, reason)) {
          return;
        }
        onChangeValues(newValue as number[]);
      }}
      disabled={!!fetchingSchedule}
    />
  );
};
