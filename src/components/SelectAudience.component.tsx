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
import { IAudienceData } from '@/interfaces/ystuty.types';
import { useApi } from '@/shared/api.hook';
import {
  buildSchedulePath,
  getScheduleSelectionFromPathname,
} from '@/shared/schedule-routing.utils';
import { notifyTelegramSelectionChanged } from '@/shared/telegram/telegram.sdk';
import { useDispatch, useSelector } from '@/store';
import alertSlice from '@/store/reducer/alert/alert.slice';
import scheduleSlice, {
  getLastAudiences,
  STORE_AUDIENCE_NAME_KEY,
} from '@/store/reducer/schedule/schedule.slice';
import { StyledAutocomplete } from './StylePulseAnimation.component';

const STORE_CACHED_AUDIENCE_KEY = 'CACHED_V1_AUDIENCE::';

export const SelectAudienceComponent = (props: {
  allowMultipleRef: AllowMultipleRef;
}) => {
  const { allowMultipleRef } = props;
  const dispatch = useDispatch();
  const { formatMessage } = useIntl();
  const { fetchingSchedule } = useSelector((state) => state.schedule);
  const allowedMultiple = useSelector(
    (state) => state.schedule.allowedMultiple.audience,
  );
  const selected = useSelector(
    (state) => state.schedule.selectedItems['audience'],
  );

  const { online, previous: previousOnline, since } = useNetworkState();
  const { pathname, search, hash } = useLocation();
  const navigate = useNavigate();
  const defaultValues = React.useMemo(() => {
    const lastValues = getLastAudiences();
    let values: (string | number)[] = getScheduleSelectionFromPathname(
      pathname,
      'audience',
    );
    values = values.length > 0 ? values : lastValues;
    return values;
  }, [pathname]);

  const [audiences, setAudiences] = React.useState<IAudienceData[]>([]);
  const [isCached, setIsCached] = React.useState(false);
  const [fetchApi, isFetching] = useApi();

  const applyAudiences = React.useCallback(
    (items: IAudienceData[] | null) => {
      if (!items) {
        items = store2.get(STORE_CACHED_AUDIENCE_KEY, null);
        if (!items) {
          return;
        }
        setIsCached(true);
      } else if (items.length > 0) {
        store2.set(STORE_CACHED_AUDIENCE_KEY, items);
        setIsCached(false);
      }

      items.sort((a, b) => {
        const [a1, a2] = a.name.split('-');
        const [b1, b2] = b.name.split('-');
        if (a1 === b1) {
          const a2n = Number(a2);
          const b2n = Number(b2);
          if (isNaN(a2n) || isNaN(b2n)) {
            return a2.localeCompare(b2);
          }
          return a2n - b2n;
        }
        return a1.localeCompare(b1);
      });

      // dispatch(audiencerSlice.actions.setAudiences(items));
      setAudiences(items);
    },
    [setAudiences, setIsCached],
  );

  const loadAudiences = React.useCallback(async () => {
    if (isFetching) return;

    try {
      const response = await fetchApi<{
        isCache: boolean;
        items: IAudienceData[];
        count: number;
      }>(
        `v1/schedule/actual_audiences`,
        {},
        {
          setError: (message) =>
            dispatch(
              alertSlice.actions.add({
                message: `Error: ${message}`,
                severity: 'warning',
              }),
            ),
        },
      );

      if (!response || 'error' in response || !('data' in response)) {
        return;
      }

      applyAudiences(response.data.items);
    } catch (err) {
      // ??
      applyAudiences(null);
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
  }, [applyAudiences, online]);

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
            scheduleFor: 'audience',
            items: values,
          }),
        );
        if (values.length > 0) {
          navigate({
            pathname: buildSchedulePath('audience', values),
            search,
            hash,
          });
          store2.set(STORE_AUDIENCE_NAME_KEY, values);
        }
      }
    },
    [dispatch, hash, navigate, search, selected],
  );

  const fixSelected = React.useCallback(
    (newSelected: (string | number)[] = selected) => {
      let value = newSelected;
      if (audiences.length > 1) {
        const lowerAudienceNames = audiences.map((e) => e.name.toLowerCase());
        const lowerAudienceIds = audiences.map((e) => e.id);
        const lowerSelected = newSelected.map((e) => String(e).toLowerCase());
        value = lowerSelected
          .map((val) =>
            ((ni) =>
              ni > -1
                ? ni
                : lowerAudienceIds.findIndex((id) => String(id) === val))(
              lowerAudienceNames.findIndex((n) => n === val),
            ),
          )
          .filter((e) => e > -1)
          .map((e) => audiences[e].name);
        value = value.filter((w, i) => value.indexOf(w) === i);
      }
      if (value.length > 0) {
        onChangeValues(value as string[]);
      }
    },
    [audiences, selected, onChangeValues],
  );

  const allowMultiple = React.useCallback(
    (state = true) => {
      dispatch(
        scheduleSlice.actions.setAllowedMultiple({
          scheduleFor: 'audience',
          allowed: state,
        }),
      );
      if (!state) {
        const [value] = selected as string[];
        onChangeValues(value);
      } else {
        onChangeValues(selected as string[]);
      }
    },
    [onChangeValues, selected],
  );

  // Check correct names after institutes loading
  React.useEffect(() => {
    if (audiences.length > 1) {
      fixSelected();
    }
  }, [audiences]);

  // Синхронизируем выбор с URL при переходах по ссылкам и кнопкам браузера.
  React.useEffect(() => {
    if (!areSameScheduleSelections(defaultValues, selected)) {
      fixSelected(defaultValues);
    }
  }, [defaultValues]);

  React.useEffect(() => {
    if (shouldRefreshScheduleOptions({ online, previousOnline, since })) {
      loadAudiences();
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

  const options = React.useMemo(
    () =>
      audiences.reduce(
        (prev, cur) => {
          let { name } = cur;
          if (name === 'Актовый зал') {
            name = 'А-АктовыйЗал';
          } else if (name === 'В-корпус_библиотека') {
            name = 'В-Библиотека';
          }
          const [corpName] = name.split('-');
          prev[name] = corpName;
          return prev;
        },
        {} as Record<string, string>,
      ),
    [audiences],
  );

  const value = isMultiple
    ? audiences.length > 0
      ? selected
      : []
    : audiences.length > 0
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
      options={Object.keys(options)}
      disableCloseOnSelect
      disableListWrap
      getOptionLabel={(option) => option as string}
      groupBy={(option) => options[option as string]}
      renderInput={(params) => (
        <TextField
          {...params}
          label={`Аудитори${isMultiple ? 'и' : 'я'}${isCached ? '*' : ''}`}
          placeholder={((e) =>
            (e.length > 0 && e[Math.floor(Math.random() * e.length)]) || '...')(
            Object.keys(options),
          )}
        />
      )}
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
