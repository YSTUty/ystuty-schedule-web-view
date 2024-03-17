import { TeacherOneDayDto } from './teacher-one-day.dto';

export interface TeacherOneWeekDto {
    number: number;
    days: TeacherOneDayDto[];
}
