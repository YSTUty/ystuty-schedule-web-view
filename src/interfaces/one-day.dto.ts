import { LessonDto } from './lesson.dto';
import { WeekDayDto } from './week-day.dto';

/**
 * Filtered Days with lessons from one week
 */
export interface OneDayDto {
    info: WeekDayDto;
    lessons: LessonDto[];
}
