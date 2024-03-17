import { WeekNumberType } from './schedule.enums';

export interface WeekDayDto {
    /** Тип/номер дня недели */
    type: WeekNumberType;
    /** Дата дня недели */
    date: Date;
    /** Номер недели в семестре */
    weekNumber: number;
}
