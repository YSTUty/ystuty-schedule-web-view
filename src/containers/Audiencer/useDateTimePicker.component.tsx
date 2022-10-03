import * as React from 'react';
import { useDebounce } from 'react-use';
import { useSelector } from 'react-redux';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';

import TextField from '@mui/material/TextField';

import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { TimePicker } from '@mui/x-date-pickers/TimePicker';

export const useDatePickerComponent = () => {
    const [date1, setDate1] = React.useState<Dayjs | null>(null);
    const [date2, setDate2] = React.useState<Dayjs | null>(null);
    const [value1, setValue1] = React.useState<Dayjs | null>(date1);
    const [value2, setValue2] = React.useState<Dayjs | null>(date2);

    const { accumulatives } = useSelector((state) => state.audiencer);

    // Correct formation of the date interval "from and to"
    React.useEffect(() => {
        if (value1 && value2 && value1.isAfter(value2)) {
            setValue1(value2);
            setValue2(value1);
        }
    }, [value1, value2]);
    useDebounce(() => setDate1(value1), 1500, [value1]);
    useDebounce(() => setDate2(value2), 1500, [value2]);

    const [minDate, maxDate] = React.useMemo(() => {
        const now = dayjs();
        let minDate = now.subtract(1, 'days');
        let maxDate = now.add(1, 'days');
        for (const audience of accumulatives) {
            for (const item of audience.items) {
                const startAt = dayjs(item.startAt);
                const endAt = dayjs(item.endAt);
                if (!minDate || startAt.isBefore(minDate)) {
                    minDate = startAt;
                }
                if (!maxDate || endAt.isAfter(maxDate)) {
                    maxDate = endAt;
                }
            }
        }
        return [minDate, maxDate];
    }, [accumulatives]);

    const component = () => {
        return (
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'ru'}>
                <DatePicker
                    views={['day']}
                    minDate={minDate}
                    maxDate={maxDate}
                    inputFormat="DD.MM.YYYY"
                    label="От"
                    value={value1}
                    onChange={(val) => setValue1(val)}
                    renderInput={(params) => <TextField {...params} />}
                />
                <DatePicker
                    views={['day']}
                    minDate={minDate}
                    maxDate={maxDate}
                    inputFormat="DD.MM.YYYY"
                    label="До"
                    value={value2}
                    onChange={(val) => setValue2(val)}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
        );
    };

    return [component, [date1, date2], [setDate1, setDate2]] as const;
};

export const useTimePickerComponent = () => {
    const [time1, setTime1] = React.useState<Dayjs | null>(null);
    const [time2, setTime2] = React.useState<Dayjs | null>(null);
    const [value1, setValue1] = React.useState<Dayjs | null>(time1);
    const [value2, setValue2] = React.useState<Dayjs | null>(time2);

    // Correct formation of the date interval "from and to"
    React.useEffect(() => {
        if (value1 && value2 && value1.isAfter(value2)) {
            setValue1(value2);
            setValue2(value1);
        }
    }, [value1, value2]);
    useDebounce(() => setTime1(value1), 1500, [value1]);
    useDebounce(() => setTime2(value2), 1500, [value2]);

    const component = () => {
        return (
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'ru'}>
                <TimePicker
                    minTime={dayjs('07:00', 'HH:mm')}
                    maxTime={dayjs('22:00', 'HH:mm')}
                    inputFormat="HH:mm"
                    mask="__:__"
                    label="От"
                    value={value1}
                    onChange={(val) => setValue1(val)}
                    renderInput={(params) => <TextField {...params} />}
                />
                <TimePicker
                    minTime={dayjs('07:00', 'HH:mm')}
                    maxTime={dayjs('22:00', 'HH:mm')}
                    inputFormat="HH:mm"
                    mask="__:__"
                    label="До"
                    value={value2}
                    onChange={(val) => setValue2(val)}
                    renderInput={(params) => <TextField {...params} />}
                />
            </LocalizationProvider>
        );
    };

    return [component, [time1, time2], [setTime1, setTime2]] as const;
};
