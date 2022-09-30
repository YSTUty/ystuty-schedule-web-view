import * as React from 'react';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/ru';
import { useDebounce } from 'react-use';

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

    useDebounce(() => setDate1(value1), 1500, [value1]);
    useDebounce(() => setDate2(value2), 1500, [value2]);

    // TODO: calculate minDate and maxDate

    const component = () => {
        return (
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'ru'}>
                <DatePicker
                    views={['day']}
                    // minDate={dayjs('2022-08-01')}
                    // maxDate={dayjs('2023-06-01')}
                    inputFormat="DD.MM.YYYY"
                    label="От"
                    value={value1}
                    onChange={(val) => setValue1(val)}
                    renderInput={(params) => <TextField {...params} />}
                />
                <DatePicker
                    views={['day']}
                    // minDate={dayjs('2022-08-01')}
                    // maxDate={dayjs('2023-06-01')}
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

    useDebounce(() => setTime1(value1), 1500, [value1]);
    useDebounce(() => setTime2(value2), 1500, [value2]);

    const component = () => {
        return (
            <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale={'ru'}>
                <TimePicker
                    ampm={false}
                    openTo="hours"
                    views={['hours', 'minutes']}
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
                    ampm={false}
                    openTo="hours"
                    views={['hours', 'minutes']}
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
