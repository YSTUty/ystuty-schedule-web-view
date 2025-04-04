import React from 'react';
import { useHash, useNetworkState } from 'react-use';
import { useDispatch, useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import classNames from 'clsx';
import store2 from 'store2';

import { autocompleteClasses } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Popper, { PopperProps } from '@mui/material/Popper';
import { styled } from '@mui/material/styles';

import { StyledAutocomplete } from './StylePulseAnimation.component';
import scheduleSlice, { getLastGroups, STORE_GROUP_NAME_KEY } from '../store/reducer/schedule/schedule.slice';
import alertSlice from '../store/reducer/alert/alert.slice';
import { useApi } from '../shared/api.hook';
import { IInstituteGroupsData } from '../interfaces/ystuty.types';

// const STORE_CACHED_INSTITUTES_KEY_OLD = 'CACHED_INSTITUTES';
const STORE_CACHED_INSTITUTES_KEY = 'CACHED_V3_INSTITUTES::';

const StyledPopper = styled(Popper)({
    [`& .${autocompleteClasses.listbox}`]: {
        '& ul': { margin: 0 },
        '& li': { margin: 0 },
    },
});

const MyPopper = (props: PopperProps) => <StyledPopper {...props} style={{ width: 350 }} />;

export const SelectGroupComponent = (props: { allowMultipleRef: React.MutableRefObject<(state?: any) => void> }) => {
    const { allowMultipleRef } = props;
    const dispatch = useDispatch();
    const { formatMessage } = useIntl();
    const { fetchingSchedule } = useSelector((state) => state.schedule);
    const allowedMultiple = useSelector((state) => state.schedule.allowedMultiple.group);
    const selected = useSelector((state) => state.schedule.selectedItems['group']) as string[];

    const { online, previous: previousOnline, since } = useNetworkState();
    const [hash, setHash] = useHash();
    const defaultValues = React.useMemo(() => {
        const groupNames = getLastGroups();
        const defaultHash = decodeURI(hash.slice(1));
        let values = defaultHash.split(',').filter((e) => e.length > 0);
        values = values.length > 0 ? values : groupNames;
        return values;
    }, [hash]);
    const [institutes, setInstitutes] = React.useState<{ name: string; groups: string[] }[]>([
        // { name: 'Default', groups: defaultValues },
    ]);
    const [fetchApi, isFetching] = useApi();
    const [isCached, setIsCached] = React.useState(false);

    const applyInstitutes = React.useCallback(
        (items: IInstituteGroupsData[] | null) => {
            if (!items) {
                items = store2.get(STORE_CACHED_INSTITUTES_KEY, null);
                if (!items) {
                    return;
                }
                setIsCached(true);
            } else if (items.length > 0) {
                store2.set(STORE_CACHED_INSTITUTES_KEY, items);
                setIsCached(false);
            }

            // items.sort();
            setInstitutes(items);
        },
        [setInstitutes, setIsCached],
    );

    const loadGroupsList = React.useCallback(async () => {
        if (isFetching) return;

        try {
            const response = await fetchApi<{
                name: string;
                items: IInstituteGroupsData[];
                isCache: boolean;
            }>(
                `v1/schedule/actual_groups`,
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

            applyInstitutes(response.data.items);
        } catch (err) {
            // ??
            applyInstitutes(null);
            if (online) {
                dispatch(
                    alertSlice.actions.add({
                        message: `Error: ${(err as Error).message}`,
                        severity: 'error',
                    }),
                );
            } else {
                toast.warning(formatMessage({ id: 't.api.offline.error' }));
            }
        }
    }, [applyInstitutes, online]);

    const onChangeValues = React.useCallback(
        (value: string | string[] | null) => {
            value = !value ? [] : typeof value !== 'string' ? value : value.split(',');
            value = value.filter(Boolean);
            const maxGroups = 4 - 1;
            const values = value.length > maxGroups ? [value[0], ...value.slice(-maxGroups)] : value;

            if (values.length !== selected.length || values.some((e, i) => selected[i] !== e)) {
                dispatch(scheduleSlice.actions.setSelectedItems({ scheduleFor: 'group', items: values }));
                if (values.length > 0) {
                    setHash(values.join(','));
                    store2.set(STORE_GROUP_NAME_KEY, values);
                }
            }
        },
        [dispatch, setHash, selected],
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
            dispatch(scheduleSlice.actions.setAllowedMultiple({ scheduleFor: 'group', allowed: state }));
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

    // On location hash changed
    React.useEffect(() => {
        if (defaultValues.some((e, i) => selected[i] !== e) || defaultValues.length !== selected.length) {
            fixSelected(defaultValues);
        }
    }, [defaultValues]);

    React.useEffect(() => {
        if (online !== previousOnline || (since && Date.now() - since.getTime() > 2 * 60e3)) {
            loadGroupsList();
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
            institutes.reduce(
                (prev, cur) => ({ ...prev, ...Object.fromEntries(cur.groups.map((g) => [g, cur.name])) }),
                {} as Record<string, string>,
            ),
        [institutes],
    );
    const sortedOptions = React.useMemo(
        () => Object.keys(options).sort((a, b) => options[a].localeCompare(options[b])),
        [options],
    );

    const value = isMultiple ? (institutes.length > 0 ? selected : []) : institutes.length > 0 ? selected[0] : '';

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
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={`Групп${isMultiple ? 'ы' : 'а'}${isCached ? '*' : ''}`}
                    placeholder={((e) => (e.length > 0 && e[Math.floor(Math.random() * e.length)]) || '...')(
                        Object.keys(options),
                    )}
                />
            )}
            PopperComponent={MyPopper}
            value={value}
            onChange={(event, newValue, reason) => {
                if (
                    event.type === 'keydown' &&
                    (event as React.KeyboardEvent).key === 'Backspace' &&
                    reason === 'removeOption'
                ) {
                    return;
                }
                onChangeValues(newValue as string[]);
            }}
            disabled={!!fetchingSchedule}
        />
    );
};
