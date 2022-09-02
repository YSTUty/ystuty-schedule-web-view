import React from 'react';
import { useHash, useNetworkState } from 'react-use';
import { useDispatch, useSelector } from 'react-redux';
import store2 from 'store2';

import Autocomplete, { autocompleteClasses } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Popper, { PopperProps } from '@mui/material/Popper';
import { styled } from '@mui/material/styles';

import scheduleSlice, { getDefaultTeacher, STORE_TEACHER_NAME_KEY } from '../store/reducer/schedule/schedule.slice';
import alertSlice from '../store/reducer/alert/alert.slice';
import { apiPath } from '../utils';
import { ITeacherData } from '../interfaces/ystuty.types';

const STORE_CACHED_TEACHERS_KEY = 'cachedTeachers';

const StyledPopper = styled(Popper)({
    [`& .${autocompleteClasses.listbox}`]: {
        '& ul': { margin: 0 },
        '& li': { margin: 0 },
    },
});

const MyPopper = (props: PopperProps) => <StyledPopper {...props} style={{ width: 350 }} />;

export const SelectTeacherComponent = (props: {
    allowMultipleTeachersRef: React.MutableRefObject<(state?: any) => void>;
}) => {
    const { allowMultipleTeachersRef } = props;
    const dispatch = useDispatch();
    const {
        selectedTeachers: selected,
        fetchingSchedule,
        allowedMultipleTeachers: allowedMultiple,
    } = useSelector((state) => state.schedule);
    const { online, previous: previousOnline, since } = useNetworkState();

    const [hash, setHash] = useHash();

    const [teachers, setTeachers] = React.useState<ITeacherData[]>([]);
    const [fetching, setFetching] = React.useState(false);
    const [isCached, setIsCached] = React.useState(false);

    const defaultValues: number[] = React.useMemo(() => {
        const teacherId = getDefaultTeacher();
        const defaultHash = ((e) =>
            e
                ?.split(',')
                .map<number>((e) => Number(e))
                .filter((e) => e /* .id */ > 0) || [])(decodeURI(hash.slice(1)));
        const values = defaultHash.length > 0 ? defaultHash : teacherId ? [teacherId] : [];
        // store2.set(STORE_TEACHER_NAME_KEY, values[0]);
        return values;
    }, [hash, teachers]);

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
        [setTeachers, setIsCached]
    );

    const loadTeachersList = React.useCallback(() => {
        if (fetching) {
            return;
        }

        setFetching(true);

        fetch(`${apiPath}/ystu/schedule/teachers`)
            .then((response) => response.json())
            .then(
                (
                    response: { items: { name: string; id: number }[] } | { error: { error: string; message: string } }
                ) => {
                    if ('error' in response) {
                        dispatch(
                            alertSlice.actions.add({
                                message: `Error: ${response.error.message}`,
                                severity: 'warning',
                            })
                        );
                        return;
                    }
                    applyTeachers(response!.items);
                }
            )
            .catch((e) => {
                applyTeachers(null);
                if (online) {
                    dispatch(
                        alertSlice.actions.add({
                            message: `Error: ${e.message}`,
                            severity: 'error',
                        })
                    );
                }
            })
            .finally(() => {
                setFetching(false);
            });
    }, [fetching, setFetching, applyTeachers, online]);

    const onChangeValues = React.useCallback(
        (value: number | number[] | null) => {
            value = !value ? [] : Array.isArray(value) ? value : [value];
            const teacherId = getDefaultTeacher();
            let values: number[] = value.length > 0 ? value : teacherId ? [teacherId] : [];
            const maxCount = 4 - 1;
            values = values.length > maxCount ? [values[0], ...values.slice(-maxCount)] : values;

            if (values.length !== selected.length || values.some((e, i) => selected[i] !== e)) {
                dispatch(scheduleSlice.actions.setSelectedTeachers(values));
                setHash(values.map((e) => e /* .id */).join(','));
                if (values[0]) {
                    store2.set(STORE_TEACHER_NAME_KEY, values[0]);
                }
            }
        },
        [dispatch, setHash, selected]
    );

    const fixSelected = React.useCallback(
        (newSelected: number[] = selected) => {
            let value = newSelected;
            if (teachers.length > 1) {
                value = teachers
                    .map((teacher) => newSelected.find((selected) => teacher.id === selected))
                    // .map((selected) => teachers.find((teacher) => teacher.id === selected.id))
                    .filter(Boolean) as number[];
                // value = value.filter((w, i) => value.indexOf(w) === i);
            }
            if (value) {
                onChangeValues(value);
            }
        },
        [teachers, selected, onChangeValues]
    );

    const allowMultiple = React.useCallback(
        (state = true) => {
            dispatch(scheduleSlice.actions.setAllowedMultipleTeachers(state));
            if (!state) {
                const [value] = selected;
                onChangeValues(value);
            } else {
                onChangeValues(selected);
            }
        },
        [onChangeValues, selected]
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
        if (online && (online !== previousOnline || (since && Date.now() - since.getTime() > 2 * 60e3))) {
            loadTeachersList();
        }
    }, [online, previousOnline, since]);

    React.useEffect(() => {
        loadTeachersList();
        fixSelected(defaultValues);

        allowMultipleTeachersRef.current = allowMultiple;
    }, []);

    const isMultiple = allowedMultiple || selected.length > 1;

    return (
        <Autocomplete
            multiple={isMultiple}
            sx={{ minWidth: 200, maxWidth: 400 }}
            id="teachers-native-select"
            options={teachers.map((e) => e.id)}
            disableCloseOnSelect={isMultiple}
            disableListWrap
            getOptionLabel={(option) => teachers.find((e) => option === e.id)?.name || 'NoName'}
            // groupBy={(option) => options[option]}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={`Преподавател${isMultiple ? 'и' : 'ь'}`}
                    placeholder={((e) => (e.length > 0 && e[Math.floor(Math.random() * e.length)].name) || '...')(
                        teachers
                    )}
                />
            )}
            PopperComponent={MyPopper}
            value={!isMultiple && Array.isArray(selected) ? selected[0] : selected}
            onChange={(event, newValue, reason) => {
                if (
                    event.type === 'keydown' &&
                    (event as React.KeyboardEvent).key === 'Backspace' &&
                    reason === 'removeOption'
                ) {
                    return;
                }
                onChangeValues(newValue);
            }}
            disabled={!!fetchingSchedule}
        />
    );
};