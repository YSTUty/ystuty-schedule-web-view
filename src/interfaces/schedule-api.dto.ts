import type { OneWeekDto } from './schedule';
import type { IAudienceData, ITeacherData } from './ystuty.types';

/** Публичный идентификатор опубликованного расписания (семестра). */
export type ScheduleSemesterId = number;

/** Метаданные Redis-кэша, возвращаемые актуальной версией Schedule API. */
export type ScheduleCacheMetadataDto = {
  isCached: boolean;
  ttlSeconds: number | null;
};

/**
 * Общая часть кэшируемых ответов Schedule API.
 *
 * `isCache` оставлен для совместимости со старыми развёртываниями API.
 * В новом коде значение следует читать через `getScheduleCacheState`.
 */
export type ScheduleCacheableResponse = {
  cache?: ScheduleCacheMetadataDto;
  /** @deprecated Используйте `cache.isCached`. */
  isCache?: boolean;
};

export type ScheduleAcademicYearDto = {
  id: number | null;
  name: string | null;
};

export type ScheduleSemesterSummaryDto = {
  id: number | null;
  name: string | null;
  number: number | null;
};

/**
 * Стабильный публичный DTO опубликованного семестра из `/all_semesters`.
 * Не содержит внутренних полей TypeORM.
 */
export type ScheduleSemesterDto = {
  id: ScheduleSemesterId;
  academicYear: ScheduleAcademicYearDto;
  semester: ScheduleSemesterSummaryDto;
  startsAt: string | null;
  endsAt: string | null;
  isPublished: boolean;
};

export type ScheduleCountResponseDto = ScheduleCacheableResponse & {
  institutes: number;
  groups: number;
  teachers: number;
  audiences: number;
};

/** Детальная группа, которую API возвращает только с `additional=true`. */
export type ScheduleGroupDetailDto = {
  course: number;
  name: string;
  /** @deprecated Используйте `groupId`. */
  id_schedule?: number | null;
  groupId?: number | null;
  hasLecture: boolean;
  scheduleName: string;
};

export type ScheduleInstituteGroupsDto<TGroup = string> = {
  id?: number | null;
  name: string;
  groups: TGroup[];
};

/**
 * Стандартный ответ актуальных групп. По умолчанию `groups` содержит строки;
 * с `additional=true` используйте `ActualGroupsResponseDto<ScheduleGroupDetailDto>`.
 */
export type ActualGroupsResponseDto<TGroup = string> =
  ScheduleCacheableResponse & {
    /** @deprecated Название расписания не является стабильной частью контракта. */
    name?: string | null;
    items: ScheduleInstituteGroupsDto<TGroup>[];
  };

export type IdNameListResponseDto<TItem> = ScheduleCacheableResponse & {
  items: TItem[];
  count: number;
};

export type ActualTeachersResponseDto = IdNameListResponseDto<ITeacherData>;

export type ActualAudiencesResponseDto = IdNameListResponseDto<IAudienceData>;

export type ScheduleItemsResponseDto = ScheduleCacheableResponse & {
  items: OneWeekDto[];
};

export type TeacherScheduleResponseDto = ScheduleItemsResponseDto & {
  teacher: ITeacherData;
};
