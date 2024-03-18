import { LessonFlags } from './schedule';

/**
 * Название института и массив групп
 */
export interface IInstituteGroupsData {
    /**
     * Название института
     * @example Институт цифровых систем
     */
    name: string;

    /**
     * Название групп (`string`) или детальная информация (`object`) о группах при `additional=true`
     */
    groups: /* GroupDetailDto | */ string[];
}

/**
 * Данные об институте
 */
export interface IInstituteData {
    /**
     * Название института
     */
    name: string;
    /**
     * Массив групп
     */
    groups: IGroupData[];
}

/**
 * Данные о группе
 */
export interface IGroupData {
    /**
     * Название группы
     */
    name: string;
    /**
     * Ссылка на расписание группы
     */
    link: string;
    /**
     * Ссылка на расписание лекционной недели группы
     */
    linkLecture?: string;
}

// ****

export interface ITeacherData {
    name: string;
    id: number;
}

export interface IAudienceData {
    id: number;
    name: string;
}

export interface AccumulativeSchedule {
    /** Номер аудитории */
    id: number;
    /** Название аудитории */
    name: string;
    /** Расписание */
    items: AudienceLesson[];
    /** Время обновления */
    time: number;
}

export interface AudienceLesson {
    /**
     * Порядковый номер пары на дню
     */
    number: number;
    /**
     * Временной интервал пары
     */
    timeRange: string;
    /**
     * Timestamp начала пары
     */
    startAt: string | Date;
    /**
     * Timestamp конца пары
     */
    endAt: string | Date;
    /**
     * Пара дистанционно
     */
    isDistant?: true;
    /**
     * Название предмета пары
     */
    lessonName?: string;
    /**
     * Флаг типа пары
     */
    type: LessonFlags;
    /**
     * Длительность пары в часах
     */
    duration: number;
    /**
     * Длительность пары в минутах
     */
    // durationMinutes: number;
    /**
     * Названия групп
     */
    groups: string[];
    /**
     * ФИО преподователя
     */
    teacherName: string;
}
