import { LessonDto } from './lesson.dto';
import { LessonFlags } from './schedule.enums';

export interface TeacherLessonDto extends Omit<LessonDto, 'teacherName'> {
    /**
     * Названия групп
     */
    groups: string[];

    additionalTeacher?: {
        name: string;
        id: number;
    };
}

export type TeacherLessonData = TeacherLessonDto & {
    start: string | Date;
    end: string | Date;
    title: string;
    typeArr: LessonFlags[];
};
