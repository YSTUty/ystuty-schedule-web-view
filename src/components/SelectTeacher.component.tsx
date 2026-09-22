import React from 'react';
import { useLocation, useNavigate } from 'react-router';
import store2 from 'store2';
import classNames from 'clsx';

import TextField from '@mui/material/TextField';

import {
  AllowMultipleRef,
  areSameScheduleSelections,
  limitScheduleSelections,
  ScheduleSelectorPopper,
  ServerCacheTooltip,
  shouldIgnoreAutocompleteRemoval,
} from '@components/ScheduleSelector.shared';
import { ITeacherData } from '@/interfaces/ystuty.types';
import {
  getScheduleLookupSnapshot,
  ScheduleLookupConfig,
  useScheduleLookup,
} from '@/shared/schedule-lookup.hook';
import { getTeacherSelectionPathRoute } from '@/shared/schedule-routing.utils';
import { notifyTelegramSelectionChanged } from '@/shared/telegram/telegram.sdk';
import { useDispatch, useSelector } from '@/store';
import scheduleSlice, {
  getLastTeachers,
  STORE_TEACHER_NAME_KEY,
} from '@/store/reducer/schedule/schedule.slice';
import { StyledAutocomplete } from './StylePulseAnimation.component';

// const STORE_CACHED_TEACHERS_KEY_OLD = 'cachedTeachers';
const STORE_CACHED_TEACHERS_KEY = 'CACHED_V3_TEACHERS::';
const TEACHERS_CACHE_KEY = 'actual-teachers';
type TeachersLookupResponse = {
  isCache?: boolean;
  items: ITeacherData[];
};

const TEACHERS_LOOKUP: ScheduleLookupConfig<
  ITeacherData,
  TeachersLookupResponse
> = {
  apiPath: 'v1/schedule/actual_teachers',
  cacheKey: TEACHERS_CACHE_KEY,
  cachedMessage: 'Используется сохранённый список преподавателей.',
  legacyStorageKey: STORE_CACHED_TEACHERS_KEY,
  writeLegacyCacheOnApiSuccess: true,
};

export const getTeachers = () => getScheduleLookupSnapshot(TEACHERS_LOOKUP);

export const SelectTeacherComponent = (props: {
  allowMultipleRef: AllowMultipleRef;
}) => {
  const { allowMultipleRef } = props;
  const dispatch = useDispatch();
  const { fetchingSchedule } = useSelector((state) => state.schedule);
  const allowedMultiple = useSelector(
    (state) => state.schedule.allowedMultiple.teacher,
  );
  const selected = useSelector(
    (state) => state.schedule.selectedItems.teacher,
  ) as number[];
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();

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

  const {
    items: teachers,
    isCached,
    isServerCached,
  } = useScheduleLookup(TEACHERS_LOOKUP);

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
  const getTeacherOptionLabel = (option: unknown) => {
    const teacherId = Number(option);
    const teacher = teachers.find((item) => item.id === teacherId);
    return teacher ? `${teacher.name} [${teacher.id}]` : `#${teacherId}`;
  };

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
      getOptionLabel={getTeacherOptionLabel}
      // groupBy={(option) => options[option]}
      renderOption={(optionProps, option) => {
        const teacherId = Number(option);
        const teacher = teachers.find((item) => item.id === teacherId);

        return (
          <li {...optionProps}>
            {teacher?.name || 'NoName'}
            <span
              style={{
                fontSize: '0.8em',
                marginLeft: 4,
                opacity: 0.7,
              }}>
              [{teacherId}]
            </span>
          </li>
        );
      }}
      renderInput={(params) => {
        const input = (
          <TextField
            {...params}
            label={`Преподавател${isMultiple ? 'и' : 'ь'}${
              isCached ? ` (кэш${isServerCached ? '*' : ''})` : ''
            }`}
            placeholder={((e) =>
              (e.length > 0 && e[Math.floor(Math.random() * e.length)].name) ||
              '...')(teachers)}
          />
        );

        return isServerCached ? (
          <ServerCacheTooltip>{input}</ServerCacheTooltip>
        ) : (
          input
        );
      }}
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
