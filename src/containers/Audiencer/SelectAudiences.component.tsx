import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDebounce } from 'react-use';
import classNames from 'clsx';

import { autocompleteClasses } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Popper, { PopperProps } from '@mui/material/Popper';
import { styled } from '@mui/material/styles';

import { StyledAutocomplete } from '../../components/StylePulseAnimation.component';
import audiencerSlice from '../../store/reducer/audiencer/audiencer.slice';

const StyledPopper = styled(Popper)({
    [`& .${autocompleteClasses.listbox}`]: {
        '& ul': { margin: 0 },
        '& li': { margin: 0 },
    },
});

const MyPopper = (props: PopperProps) => <StyledPopper {...props} style={{ width: 350 }} />;

export const SelectAudiencesComponent = (props: { withDebounce?: boolean }) => {
    const { withDebounce = false } = props;
    const dispatch = useDispatch();
    const { audiences, selectedAudiences } = useSelector((state) => state.audiencer);

    // withDebounce
    const [selected, setValues] = React.useState<string[]>(selectedAudiences);

    useDebounce(
        () => {
            dispatch(audiencerSlice.actions.setSelectedGroups(selected));
        },
        withDebounce ? 2e3 : 0,
        [selected],
    );

    const onChangeValues = React.useCallback(
        (values: string[] | null) => {
            values = !values ? [] : values;
            values = values.filter(Boolean);

            if (values.length !== selected.length || values.some((e, i) => selected[i] !== e)) {
                setValues(values);
            }
        },
        [selected],
    );

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

    return (
        <StyledAutocomplete
            className={classNames({
                ['pulsation']: !selected,
            })}
            multiple
            size="small"
            sx={{ minWidth: 200 }}
            id="grouped-native-select"
            options={Object.keys(options)}
            disableCloseOnSelect
            disableListWrap
            getOptionLabel={(option) => option as string}
            groupBy={(option) => options[option as string]}
            renderInput={(params) => (
                <TextField
                    {...params}
                    label="Аудитории"
                    placeholder={((e) => (e.length > 0 && e[Math.floor(Math.random() * e.length)]) || '...')(
                        Object.keys(options),
                    )}
                />
            )}
            PopperComponent={MyPopper}
            value={selected}
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
            disabled={audiences.length === 0}
        />
    );
};
