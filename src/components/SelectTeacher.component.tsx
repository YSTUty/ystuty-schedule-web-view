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
  shouldRefreshScheduleOptions,
} from '@components/ScheduleSelector.shared';
import { ITeacherData } from '@/interfaces/ystuty.types';
import { useApi } from '@/shared/api.hook';
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

export const getTeachers = () =>
  store2.get(STORE_CACHED_TEACHERS_KEY, null) as ITeacherData[] | null;

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
  const { online, previous: previousOnline, since } = useNetworkState();

  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();

  const [teachers, setTeachers] = React.useState<ITeacherData[]>([]);
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
    (items: ITeacherData[] | null) => {
      if (!items) {
        items = store2.get(STORE_CACHED_TEACHERS_KEY, null);
        if (!items) {
          return;
        }
        setIsCached(true);
      } else if (items.length > 0) {
        store2.set(STORE_CACHED_TEACHERS_KEY, items);
        setIsCached(false);
      }

      // items.sort();
      setTeachers(items);
    },
    [setTeachers, setIsCached],
  );

  const loadTeachersList = React.useCallback(async () => {
    if (isFetching) return;

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
        return;
      }
      applyTeachers(response.data.items);
    } catch (err) {
      // ??
      applyTeachers(null);
      if (online) {
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
  }, [applyTeachers, online]);

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
    if (shouldRefreshScheduleOptions({ online, previousOnline, since })) {
      loadTeachersList();
    }
  }, [online, previousOnline, since]);

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
