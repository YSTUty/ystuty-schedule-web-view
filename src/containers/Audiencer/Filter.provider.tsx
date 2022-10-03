import React from 'react';
import { useDebounce } from 'react-use';

import TextField from '@mui/material/TextField';

type FilterKeys = 'audience' | 'lesson';
export type FiltersListType = Record<
    FilterKeys,
    {
        value: string;
        label: string;
        placeholder: string;
    }
>;

export const FilterContext = React.createContext({
    filters: {} as FiltersListType,
    updateFilters: (() => {}) as React.Dispatch<React.SetStateAction<FiltersListType>>,
});

export const FilterComponent = (props: {
    label: string;
    placeholder: string;
    value: string;
    updateValue: (e: string) => void;
}) => {
    const { label, placeholder, value, updateValue } = props;
    const [val, setVal] = React.useState(value);

    useDebounce(() => updateValue(val), 1200, [val]);

    return (
        <TextField
            size="small"
            label={label}
            placeholder={placeholder}
            value={val}
            onChange={({ currentTarget }) => {
                setVal(currentTarget.value);
            }}
            variant="outlined"
            hiddenLabel
            margin="dense"
        />
    );
};

export const FiltersList = (props: { except?: FilterKeys[] }) => {
    const { except = [] } = props;
    const { filters, updateFilters } = React.useContext(FilterContext);

    return (
        <>
            {(Object.keys(filters) as (keyof FiltersListType)[])
                .filter((e) => !except.includes(e))
                .map((key) => (
                    <FilterComponent
                        key={key}
                        updateValue={(val) =>
                            updateFilters((e) => {
                                e[key].value = val;
                                return { ...e };
                            })
                        }
                        {...filters[key]}
                    />
                ))}
        </>
    );
};

export const FiltersProvider = (props: { children: any }) => {
    const [filters, updateFilters] = React.useState<FiltersListType>({
        audience: {
            value: 'г-5',
            label: 'Аудитории (через запятую)',
            placeholder: 'Г-501,г-62,А-31',
        },
        lesson: {
            value: '',
            label: 'Предметы, группы и преподаватели',
            placeholder: 'эис-46,овр-',
        },
    });

    const valueFf = React.useMemo(() => ({ filters, updateFilters }), [filters]);

    return <FilterContext.Provider value={valueFf}>{props.children}</FilterContext.Provider>;
};
