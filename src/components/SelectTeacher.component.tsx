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
import scheduleSlice, { getLastTeachers, STORE_TEACHER_NAME_KEY } from '../store/reducer/schedule/schedule.slice';
import alertSlice from '../store/reducer/alert/alert.slice';
import { useApi } from '../shared/api.hook';

import { ITeacherData } from '../interfaces/ystuty.types';

// const STORE_CACHED_TEACHERS_KEY_OLD = 'cachedTeachers';
const STORE_CACHED_TEACHERS_KEY = 'CACHED_V3_TEACHERS::';

export const getTeachers = () => store2.get(STORE_CACHED_TEACHERS_KEY, null) as ITeacherData[] | null;

const StyledPopper = styled(Popper)({
    [`& .${autocompleteClasses.listbox}`]: {
        '& ul': { margin: 0 },
        '& li': { margin: 0 },
    },
});

const MyPopper = (props: PopperProps) => <StyledPopper {...props} style={{ width: 350 }} />;

export const SelectTeacherComponent = (props: { allowMultipleRef: React.MutableRefObject<(state?: any) => void> }) => {
    const { allowMultipleRef } = props;
    const dispatch = useDispatch();
    const { formatMessage } = useIntl();
    const { fetchingSchedule } = useSelector((state) => state.schedule);
    const allowedMultiple = useSelector((state) => state.schedule.allowedMultiple.teacher);
    const selected = useSelector((state) => state.schedule.selectedItems.teacher) as number[];
    const { online, previous: previousOnline, since } = useNetworkState();

    const [hash, setHash] = useHash();

    const [teachers, setTeachers] = React.useState<ITeacherData[]>([]);
    const [fetchApi, isFetching] = useApi();
    const [isCached, setIsCached] = React.useState(false);

    const defaultValues: number[] = React.useMemo(() => {
        const teacherIds = getLastTeachers();
        let values = ((e) =>
            e
                ?.split(',')
                .map<number>((e) => Number(e))
                .filter((e) => e /* .id */ > 0) || [])(decodeURI(hash.slice(1)));
        values = values.length > 0 ? values : teacherIds;
        return values;
    }, [hash]);

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
                toast.warning(formatMessage({ id: 't.api.offline.error' }));
            }
        }
    }, [applyTeachers, online]);

    const onChangeValues = React.useCallback(
        (value: number | number[] | null) => {
            value = !value ? [] : Array.isArray(value) ? value : [value];
            value = value.filter(Boolean);
            const maxCount = 4 - 1;
            const values = value.length > maxCount ? [value[0], ...value.slice(-maxCount)] : value;

            if (values.length !== selected.length || values.some((e, i) => selected[i] !== e)) {
                dispatch(scheduleSlice.actions.setSelectedItems({ scheduleFor: 'teacher', items: values }));
                if (values.length > 0) {
                    setHash(values.join(','));
                    store2.set(STORE_TEACHER_NAME_KEY, values);
                }
            }
        },
        [dispatch, setHash, selected],
    );

    const fixSelected = React.useCallback(
        (newSelected: number[] = selected) => {
            let value = newSelected;
            if (teachers.length > 1) {
                value = teachers
                    .map((teacher) => newSelected.find((selected) => teacher.id === selected))
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
            dispatch(scheduleSlice.actions.setAllowedMultiple({ scheduleFor: 'teacher', allowed: state }));
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

    // On location hash changed
    React.useEffect(() => {
        if (defaultValues.some((e, i) => selected[i] !== e) || defaultValues.length !== selected.length) {
            fixSelected(defaultValues);
        }
    }, [defaultValues]);

    React.useEffect(() => {
        if (online !== previousOnline || (since && Date.now() - since.getTime() > 2 * 60e3)) {
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
    const value = isMultiple ? (teachers.length > 0 ? selected : []) : teachers.length > 0 ? selected[0] : null;

    return (
        <StyledAutocomplete
            className={classNames({
                ['pulsation']: !value,
            })}
            multiple={isMultiple}
            sx={{ minWidth: 200, maxWidth: 400 }}
            size="small"
            options={teachers.map((e) => e.id)}
            disableCloseOnSelect={isMultiple}
            disableListWrap
            getOptionLabel={(option) => teachers.find((e) => option === e.id)?.name || 'NoName'}
            // groupBy={(option) => options[option]}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={`Преподавател${isMultiple ? 'и' : 'ь'}${isCached ? '*' : ''}`}
                    placeholder={((e) => (e.length > 0 && e[Math.floor(Math.random() * e.length)].name) || '...')(
                        teachers,
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
                onChangeValues(newValue as number[]);
            }}
            disabled={!!fetchingSchedule}
        />
    );
};
