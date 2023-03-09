import React from 'react';
import { useDebounce } from 'react-use';

import TextField from '@mui/material/TextField';
import LinearProgress from '@mui/material/LinearProgress';

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

export const useProgresser = (ms: number = 2e3) => {
    const defVal = 101;
    const [progress, setProgress] = React.useState(defVal);
    const [state, updateState] = React.useState(0);

    React.useEffect(() => {
        const fps = 100;
        if (state == 0) {
            return;
        }

        const timer = setInterval(() => {
            setProgress((oldProgress) => {
                if (oldProgress >= 100) {
                    clearInterval(timer);
                    return defVal;
                }
                const diff = (fps / ms) * 100;
                return Math.min(oldProgress + diff, 100);
            });
        }, fps);

        return () => {
            clearInterval(timer);
        };
    }, [ms, state]);

    const updateTimer = React.useCallback(() => {
        setProgress(0);
        updateState((e) => ++e);
    }, [setProgress, updateState]);

    return [updateTimer, progress] as const;
};

export const FilterComponent = (props: {
    label: string;
    placeholder: string;
    value: string;
    updateValue: (e: string) => void;
}) => {
    const { label, placeholder, value, updateValue } = props;
    const [val, setVal] = React.useState(value);

    const ms = 2e3;
    useDebounce(() => updateValue(val), ms, [val]);
    const [update, progress] = useProgresser(ms);

    return (
        <>
            <TextField
                size="small"
                label={label}
                placeholder={placeholder}
                value={val}
                onChange={({ currentTarget }) => {
                    setVal(currentTarget.value);
                    update();
                }}
                variant="outlined"
                hiddenLabel
                margin="dense"
            />
            <LinearProgress
                variant="determinate"
                value={progress}
                style={{ marginTop: 0 }}
                // sx={{ opacity: progress !== 101 ? 1 : 0 }}
            />
        </>
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
