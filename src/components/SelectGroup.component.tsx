import React from 'react';
import { useHash, useNetworkState } from 'react-use';
import { useDispatch, useSelector } from 'react-redux';
import store2 from 'store2';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import IconButton from '@mui/material/IconButton';

import MultipleIcon from '@mui/icons-material/LocalPizza';

import { ThemeModeButton } from './ThemeMode.component';
import VersionComponent from './Version.component';

import scheduleSlice, { STORE_GROUP_NAME_KEY } from '../store/reducer/schedule/schedule.slice';
import { apiPath } from '../utils';

export const STORE_ALLOW_MULTIPLE_GROUP_KEY = 'allowMultipleGroup';
const STORE_CACHED_INSTITUTES_KEY = 'CACHED_INSTITUTES';

const DEFAULT_GROUP: string = store2.get(STORE_GROUP_NAME_KEY, 'ЭИС-46');

export const SelectGroupComponent = (props: { fetchingSchedule: boolean; usingDefault?: boolean }) => {
    const { fetchingSchedule, usingDefault = true } = props;
    const dispatch = useDispatch();
    const { selectedGroups: selected } = useSelector((state) => state.schedule);

    const [allowedMultiple, setAllowedMultiple] = React.useState(!!store2.get(STORE_ALLOW_MULTIPLE_GROUP_KEY, false));
    const { online, previous: previousOnline, since } = useNetworkState();
    const [institutes, setInstitutes] = React.useState<{ name: string; groups: string[] }[]>([
        { name: 'Default', groups: [DEFAULT_GROUP] },
    ]);
    const [hash, setHash] = useHash();
    const defaultValues = React.useMemo(() => {
        const defaultHash = decodeURI(hash.slice(1)) || DEFAULT_GROUP;
        const values = defaultHash.split(',');
        store2.set(STORE_GROUP_NAME_KEY, values[0]);
        return values;
    }, [hash]);
    const [fetching, setFetching] = React.useState(false);
    const [isCached, setIsCached] = React.useState(false);

    const applyInstitutes = React.useCallback(
        (items: { name: string; groups: string[] }[] | null) => {
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
        [setInstitutes, setIsCached]
    );

    const loadGroupsList = React.useCallback(() => {
        if (fetching) {
            return;
        }

        // setInstitutes([]);
        setFetching(true);

        fetch(`${apiPath}/ystu/schedule/institutes`)
            .then((response) => response.json())
            .then(
                (
                    response:
                        | { items: { name: string; groups: string[] }[] }
                        | { error: { error: string; message: string } }
                ) => {
                    if ('error' in response) {
                        alert(`Error: ${response.error.message}`);
                        return;
                    }
                    applyInstitutes(response!.items);
                }
            )
            .catch((e) => {
                applyInstitutes(null);
                if (online) {
                    alert(`Fail: ${e.message}`);
                }
            })
            .finally(() => {
                setFetching(false);
            });
    }, [fetching, setFetching, applyInstitutes, online]);

    const handleChange = React.useCallback(
        ({ target: { value } }) => {
            value = typeof value === 'string' ? value.split(',') : value;
            let values: string[] = value.length > 0 ? value : [DEFAULT_GROUP];
            const maxGroups = 2;
            values = values.length > 2 ? [values[0], ...values.slice(-maxGroups)] : values;

            if (values.some((e, i) => selected[i] !== e) || values.length !== selected.length) {
                dispatch(scheduleSlice.actions.setSelected(values));
                setHash(values.join(','));
                store2.set(STORE_GROUP_NAME_KEY, values[0]);
            }
        },
        [dispatch, setHash, selected]
    );

    const fixSelected = React.useCallback(
        (_selected: string[] = selected) => {
            const groups = institutes.flatMap((e) => e.groups.map((e) => e));
            const lowerGroups = groups.map((e) => e.toLowerCase());
            const lowerSelected = _selected.map((e) => e.toLowerCase());
            let value = lowerSelected
                .map((e) => lowerGroups.findIndex((g) => g === e))
                .filter((e) => e > -1)
                .map((e) => groups[e]);
            value = value.filter((w, i) => value.indexOf(w) === i);
            handleChange({ target: { value } });
        },
        [institutes, selected, handleChange]
    );

    const allowMultiple = React.useCallback(
        (state = true) => {
            setAllowedMultiple(state);
            store2.set(STORE_ALLOW_MULTIPLE_GROUP_KEY, state);
            if (!state) {
                const value = selected[0];
                handleChange({ target: { value } });
            }
        },
        [setAllowedMultiple, handleChange, selected]
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
        if (online && (online !== previousOnline || (since && Date.now() - since.getTime() > 2 * 60e3))) {
            loadGroupsList();
        }
    }, [online, previousOnline, since]);

    React.useEffect(() => {
        loadGroupsList();

        if (window.location.search.includes('allow_multiple')) {
            allowMultiple();
        }
    }, []);

    const isMultiple = allowedMultiple || selected.length > 1;

    return (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'text.primary',
            }}
        >
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel htmlFor="grouped-native-select">Групп{isMultiple ? 'ы' : 'а'}</InputLabel>
                <Select
                    multiple={isMultiple}
                    value={selected}
                    onChange={handleChange}
                    id="grouped-native-select"
                    label={`Групп${isMultiple ? 'ы' : 'а'}`}
                    renderValue={
                        (isMultiple &&
                            ((selected: string[]) => (
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                    {selected.map((value) => (
                                        <Chip key={value} label={value} />
                                    ))}
                                </Box>
                            ))) ||
                        undefined
                    }
                    disabled={!!fetchingSchedule}
                >
                    {!usingDefault && <MenuItem value="">---</MenuItem>}
                    {institutes.map((institute) => [
                        <ListSubheader key={institute.name}>{institute.name}</ListSubheader>,
                        institute.groups.sort().map((e) => (
                            <MenuItem key={e} value={e}>
                                {e}
                            </MenuItem>
                        )),
                    ])}
                </Select>
            </FormControl>
            <FormControl sx={{ pl: 1 }}>
                <IconButton
                    onClick={() => allowMultiple(!allowedMultiple)}
                    color="inherit"
                    sx={{ transform: allowedMultiple ? 'rotate(180deg)' : '', transition: 'transform 150ms ease' }}
                >
                    <MultipleIcon />
                </IconButton>
                <ThemeModeButton />
            </FormControl>
            <FormControl sx={{ pl: 1 }}>
                <VersionComponent />
            </FormControl>
        </Box>
    );
};
