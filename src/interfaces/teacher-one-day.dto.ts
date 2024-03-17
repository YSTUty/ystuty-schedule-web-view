import { TeacherLessonDto } from './teacher-lesson.dto';
import { WeekDayDto } from './week-day.dto';

/**
 * Filtered Days with lessons from one week for teacher
 */
export interface TeacherOneDayDto {
    info: WeekDayDto;
    lessons: TeacherLessonDto[];
}
