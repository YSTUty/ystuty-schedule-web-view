import { LessonFlags, WeekParityType } from './schedule.enums';

export interface LessonDto {
    /**
     * Порядковый номер пары на дню
     */
    number: number;
    /**
     * Временной интервал пары
     * @example '08:30-10:00'
     */
    timeRange: string;
    /**
     * Timestamp начала пары
     */
    startAt?: string | Date;
    /**
     * Timestamp конца пары
     */
    endAt?: string | Date;
    /**
     * Оригинальная строка с порядковым номером пары на дню со интервалом времени
     *
     * @example '1. 08:30-...4ч'
     */
    originalTimeTitle: string;
    /**
     * Тип четности пары на неделе
     */
    parity: WeekParityType;
    /**
     * Пара дистанционно
     */
    isDistant?: boolean;
    /**
     * Название предмета пары
     */
    lessonName: string;
    /**
     * Флаг типа пары
     */
    type: LessonFlags;
    /**
     * Занятия в потоке
     */
    isStream: boolean;
    /**
     * Длительность пары в академических часах
     */
    duration: number;
    /**
     * Длительность пары в минутах
     */
    durationMinutes: number;
    /**
     * Разделение по подгруппам
     */
    isDivision: boolean;
    /**
     * Сокращенная пара
     */
    isShort?: boolean;
    /**
     * Пара на лекционной неделе
     */
    isLecture?: boolean;
    /**
     * Буква корпуса и номер аудитори
     */
    auditoryName?: string;
    /**
     * ФИО преподователя
     *
     * @example 'Иванов ИИ'
     */
    teacherName?: string;
    /**
     * Дополнительная информация
     */
    subInfo?: string;
}

export type LessonData = LessonDto & {
    start: string | Date;
    end: string | Date;
    title: string;
    typeArr: LessonFlags[];
};
