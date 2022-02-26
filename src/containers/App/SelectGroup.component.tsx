import React from 'react';
import { useHash } from 'react-use';
import store2 from 'store2';

import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import ListSubheader from '@mui/material/ListSubheader';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';

import { ThemeModeButton } from '../../components/ThemeMode.component';
import VersionComponent from '../../components/Version.component';

import { apiPath } from '../../utils';

export const STORE_GROUP_NAME_KEY = 'lastGroupName';

const DEFAULT_GROUP = store2.get(STORE_GROUP_NAME_KEY, 'ЭИС-46');

export const useSelectGroupComponent = (usingDefault = true) => {
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
    const [selected, setSelected] = React.useState<string[]>(usingDefault ? defaultValues : ['']);
    const [fetching, setFetching] = React.useState(false);

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
                        alert(response.error.message);
                        return;
                    }
                    let institutes = response!.items;
                    // institutes.sort();
                    setInstitutes(institutes);
                }
            )
            .catch((e) => {
                alert(e.message);
            })
            .finally(() => {
                setFetching(false);
            });
    }, [setInstitutes, fetching, setFetching]);

    const handleChange = React.useCallback(
        ({ target: { value } }) => {
            value = typeof value === 'string' ? value.split(',') : value;
            let values: string[] = value.length > 0 ? value : [DEFAULT_GROUP];
            values = values.length > 2 ? [values[0], ...values.slice(2)].slice(0, 2) : values;
            if (values.some((e, i) => selected[i] !== e)) {
                setSelected(values);
                setHash(values.join(','));
                store2.set(STORE_GROUP_NAME_KEY, values[0]);
            }
        },
        [setSelected, setHash, selected]
    );

    const fixSelected = React.useCallback(() => {
        const groups = institutes.flatMap((e) => e.groups.map((e) => e));
        const lowerGroups = groups.map((e) => e.toLowerCase());
        const lowerSelected = selected.map((e) => e.toLowerCase());
        let value = lowerSelected
            .map((e) => lowerGroups.findIndex((g) => g === e))
            .filter((e) => e > -1)
            .map((e) => groups[e]);
        value = value.filter((w, i) => value.indexOf(w) === i);
        handleChange({ target: { value } });
    }, [institutes, selected, handleChange]);

    React.useEffect(() => {
        if (institutes.length > 1) {
            fixSelected();
        }
    }, [institutes]);

    React.useEffect(() => {
        loadGroupsList();
    }, []);

    const render = (props: { fetchingSchedule: boolean }) => (
        <Box
            sx={{
                display: 'flex',
                alignItems: 'center',
                color: 'text.primary',
            }}
        >
            <FormControl sx={{ m: 1, minWidth: 120 }}>
                <InputLabel htmlFor="grouped-native-select">Группа</InputLabel>
                <Select
                    multiple
                    value={selected}
                    onChange={handleChange}
                    id="grouped-native-select"
                    label="Группа"
                    renderValue={(selected) => (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                            {selected.map((value) => (
                                <Chip key={value} label={value} />
                            ))}
                        </Box>
                    )}
                    disabled={!!props.fetchingSchedule}
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
                <ThemeModeButton />
            </FormControl>
            <FormControl sx={{ pl: 1 }}>
                <VersionComponent />
            </FormControl>
        </Box>
    );

    return [render, selected] as const;
};
