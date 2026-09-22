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
import type { ActualGroupsResponseDto } from '@/interfaces/schedule-api.dto';
import { scheduleApi } from '@/shared/schedule-api';
import {
  ScheduleLookupConfig,
  useScheduleLookup,
} from '@/shared/schedule-lookup.hook';
import {
  buildSchedulePath,
  getScheduleSelectionFromPathname,
} from '@/shared/schedule-routing.utils';
import { notifyTelegramSelectionChanged } from '@/shared/telegram/telegram.sdk';
import { useDispatch, useSelector } from '@/store';
import scheduleSlice, {
  getLastGroups,
  STORE_GROUP_NAME_KEY,
} from '@/store/reducer/schedule/schedule.slice';
import { StyledAutocomplete } from './StylePulseAnimation.component';

// const STORE_CACHED_INSTITUTES_KEY_OLD = 'CACHED_INSTITUTES';
const STORE_CACHED_INSTITUTES_KEY = 'CACHED_V3_INSTITUTES::';
const INSTITUTES_CACHE_KEY = 'actual-groups';

const GROUPS_LOOKUP: ScheduleLookupConfig<
  ActualGroupsResponseDto['items'][number],
  ActualGroupsResponseDto
> = {
  apiPath: scheduleApi.actualGroups(),
  cacheKey: INSTITUTES_CACHE_KEY,
  cachedMessage: 'Используется сохранённый список групп.',
  legacyStorageKey: STORE_CACHED_INSTITUTES_KEY,
};

export const SelectGroupComponent = (props: {
  allowMultipleRef: AllowMultipleRef;
}) => {
  const { allowMultipleRef } = props;
  const dispatch = useDispatch();
  const { fetchingSchedule } = useSelector((state) => state.schedule);
  const allowedMultiple = useSelector(
    (state) => state.schedule.allowedMultiple.group,
  );
  const selected = useSelector(
    (state) => state.schedule.selectedItems['group'],
  ) as string[];

  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const defaultValues = React.useMemo(() => {
    const groupNames = getLastGroups();
    let values = getScheduleSelectionFromPathname(pathname, 'group');
    values = values.length > 0 ? values : groupNames;
    return values;
  }, [pathname]);
  const {
    items: institutes,
    isCached,
    isServerCached,
  } = useScheduleLookup(GROUPS_LOOKUP);

  const onChangeValues = React.useCallback(
    (value: string | string[] | null) => {
      value = !value
        ? []
        : typeof value !== 'string'
          ? value
          : value.split(',');
      value = value.filter(Boolean);
      const values = limitScheduleSelections(value.filter(Boolean));

      if (
        values.length !== selected.length ||
        values.some((e, i) => selected[i] !== e)
      ) {
        notifyTelegramSelectionChanged();
        dispatch(
          scheduleSlice.actions.setSelectedItems({
            scheduleFor: 'group',
            items: values,
          }),
        );
        if (values.length > 0) {
          navigate({
            pathname: buildSchedulePath('group', values),
            search,
            hash,
          });
          store2.set(STORE_GROUP_NAME_KEY, values);
        }
      }
    },
    [dispatch, hash, navigate, search, selected],
  );

  const fixSelected = React.useCallback(
    (newSelected: string[] = selected) => {
      let value = newSelected;
      const groups = institutes.flatMap((e) => e.groups.map((e) => e));
      if (groups.length > 1) {
        const lowerGroups = groups.map((e) => e.toLowerCase());
        const lowerSelected = newSelected.map((e) => e.toLowerCase());
        value = lowerSelected
          .map((e) => lowerGroups.findIndex((g) => g === e))
          .filter((e) => e > -1)
          .map((e) => groups[e]);
        value = value.filter((w, i) => value.indexOf(w) === i);
      }
      if (value.length > 0) {
        onChangeValues(value);
      }
    },
    [institutes, selected, onChangeValues],
  );

  const allowMultiple = React.useCallback(
    (state = true) => {
      dispatch(
        scheduleSlice.actions.setAllowedMultiple({
          scheduleFor: 'group',
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

  // Check correct names after institutes loading
  React.useEffect(() => {
    if (institutes.length > 1) {
      fixSelected();
    }
  }, [institutes]);

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

  const options = React.useMemo(
    () =>
      institutes.reduce(
        (prev, cur) => ({
          ...prev,
          ...Object.fromEntries(cur.groups.map((g) => [g, cur.name])),
        }),
        {} as Record<string, string>,
      ),
    [institutes],
  );
  const sortedOptions = React.useMemo(
    () =>
      Object.keys(options).sort((a, b) => options[a].localeCompare(options[b])),
    [options],
  );

  const value = isMultiple
    ? institutes.length > 0
      ? selected
      : []
    : institutes.length > 0
      ? selected[0]
      : '';

  return (
    <StyledAutocomplete
      className={classNames({
        ['pulsation']: !value,
      })}
      multiple={isMultiple}
      sx={{ minWidth: 200, maxWidth: 400 }}
      size="small"
      options={sortedOptions}
      disableCloseOnSelect
      disableListWrap
      getOptionLabel={(option) => option as string}
      groupBy={(option) => options[option as string]}
      renderInput={(params) => {
        const input = (
          <TextField
            {...params}
            label={`Групп${isMultiple ? 'ы' : 'а'}${
              isCached ? ` (кэш${isServerCached ? '*' : ''})` : ''
            }`}
            placeholder={((e) =>
              (e.length > 0 && e[Math.floor(Math.random() * e.length)]) ||
              '...')(Object.keys(options))}
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
        onChangeValues(newValue as string[]);
      }}
      disabled={!!fetchingSchedule}
    />
  );
};
