import React from 'react';
import { useHash, useNetworkState } from 'react-use';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'clsx';
import store2 from 'store2';

import { autocompleteClasses } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Popper, { PopperProps } from '@mui/material/Popper';
import { styled } from '@mui/material/styles';

import { StyledAutocomplete } from './StylePulseAnimation.component';
import scheduleSlice, { getLastAudiences, STORE_AUDIENCE_NAME_KEY } from '../store/reducer/schedule/schedule.slice';
import alertSlice from '../store/reducer/alert/alert.slice';
import { apiPath } from '../utils';
import { IAudienceData } from '../interfaces/ystuty.types';

const STORE_CACHED_AUDIENCE_KEY = 'CACHED_V1_AUDIENCE::';

const StyledPopper = styled(Popper)({
    [`& .${autocompleteClasses.listbox}`]: {
        '& ul': { margin: 0 },
        '& li': { margin: 0 },
    },
});

const MyPopper = (props: PopperProps) => <StyledPopper {...props} style={{ width: 350 }} />;

export const SelectAudienceComponent = (props: { allowMultipleRef: React.MutableRefObject<(state?: any) => void> }) => {
    const { allowMultipleRef } = props;
    const dispatch = useDispatch();
    const { fetchingSchedule } = useSelector((state) => state.schedule);
    const allowedMultiple = useSelector((state) => state.schedule.allowedMultiple.audience);
    const selected = useSelector((state) => state.schedule.selectedItems['audience']);

    const { online, previous: previousOnline, since } = useNetworkState();
    const [hash, setHash] = useHash();
    const defaultValues = React.useMemo(() => {
        const lastValues = getLastAudiences();
        const defaultHash = decodeURI(hash.slice(1));
        let values: (string | number)[] = defaultHash.split(',').filter((e) => e.length > 0);
        values = values.length > 0 ? values : lastValues;
        return values;
    }, [hash]);

    const [audiences, setAudiences] = React.useState<IAudienceData[]>([]);
    const [fetching, setFetching] = React.useState(false);
    const [isCached, setIsCached] = React.useState(false);

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

    const loadAudiences = React.useCallback(() => {
        if (fetching) {
            return;
        }

        setFetching(true);

        fetch(`${apiPath}/v1/schedule/actual_audiences`)
            .then((response) => response.json())
            .then(
                (
                    response:
                        | { isCache: boolean; items: IAudienceData[]; count: number }
                        | { error: { error: string; message: string } },
                ) => {
                    if ('error' in response) {
                        dispatch(
                            alertSlice.actions.add({
                                message: `Error: ${response.error.message}`,
                                severity: 'warning',
                            }),
                        );
                        return;
                    }
                    applyAudiences(response!.items);
                },
            )
            .catch((e) => {
                applyAudiences(null);
                if (online) {
                    dispatch(
                        alertSlice.actions.add({
                            message: `Error: ${e.message}`,
                            severity: 'error',
                        }),
                    );
                }
            })
            .finally(() => {
                setFetching(false);
            });
    }, [fetching, setFetching, applyAudiences, online]);

    const onChangeValues = React.useCallback(
        (value: string | string[] | null) => {
            value = !value ? [] : typeof value !== 'string' ? value : value.split(',');
            value = value.filter(Boolean);
            const maxSelections = 4 - 1;
            const values = value.length > maxSelections ? [value[0], ...value.slice(-maxSelections)] : value;

            if (values.length !== selected.length || values.some((e, i) => selected[i] !== e)) {
                dispatch(scheduleSlice.actions.setSelectedItems({ scheduleFor: 'audience', items: values }));
                if (values.length > 0) {
                    setHash(values.join(','));
                    store2.set(STORE_AUDIENCE_NAME_KEY, values);
                }
            }
        },
        [dispatch, setHash, selected],
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
                        ((ni) => (ni > -1 ? ni : lowerAudienceIds.findIndex((id) => String(id) === val)))(
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
            dispatch(scheduleSlice.actions.setAllowedMultiple({ scheduleFor: 'audience', allowed: state }));
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

    // On location hash changed
    React.useEffect(() => {
        if (defaultValues.some((e, i) => selected[i] !== e) || defaultValues.length !== selected.length) {
            fixSelected(defaultValues);
        }
    }, [defaultValues]);

    React.useEffect(() => {
        if (online !== previousOnline || (since && Date.now() - since.getTime() > 2 * 60e3)) {
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
            audiences.reduce((prev, cur) => {
                let { name } = cur;
                if (name === 'Актовый зал') {
                    name = 'А-АктовыйЗал';
                } else if (name === 'В-корпус_библиотека') {
                    name = 'В-Библиотека';
                }
                const [corpName] = name.split('-');
                prev[name] = corpName;
                return prev;
            }, {} as Record<string, string>),
        [audiences],
    );

    const value = isMultiple ? (audiences.length > 0 ? selected : []) : audiences.length > 0 ? selected[0] : '';

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