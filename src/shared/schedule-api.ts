import type {
  ScheduleCacheableResponse,
  ScheduleSemesterId,
} from '@/interfaces/schedule-api.dto';
import type { ScheduleFor } from '@/interfaces/ystuty.types';

const SCHEDULE_API_ROOT = 'v1/schedule';

export type ScheduleSemesterParams = {
  /** Публичный идентификатор опубликованного семестра. */
  semesterId?: ScheduleSemesterId;
};

export type ActualGroupsParams = ScheduleSemesterParams & {
  /** Возвращает расширенные сведения о группах вместо одних названий. */
  additional?: boolean;
};

export type ScheduleCacheState = {
  isCached: boolean;
  ttlSeconds: number | null;
};

function addScheduleParams(
  endpoint: string,
  params: ScheduleSemesterParams = {},
) {
  if (params.semesterId === undefined) {
    return endpoint;
  }

  if (!Number.isSafeInteger(params.semesterId) || params.semesterId < 1) {
    throw new RangeError('semesterId must be a positive integer');
  }

  return `${endpoint}?${new URLSearchParams({
    semesterId: String(params.semesterId),
  })}`;
}

/**
 * Собирает относительные пути Schedule API. Это seam между UI и HTTP-клиентом:
 * TanStack Query позднее сможет использовать те же функции без смены контракта.
 */
export const scheduleApi = {
  count: (params?: ScheduleSemesterParams) =>
    addScheduleParams(`${SCHEDULE_API_ROOT}/count`, params),

  actualGroups: (params: ActualGroupsParams = {}) => {
    const endpoint = addScheduleParams(
      `${SCHEDULE_API_ROOT}/actual_groups`,
      params,
    );

    return params.additional
      ? `${endpoint}${endpoint.includes('?') ? '&' : '?'}additional=true`
      : endpoint;
  },

  actualTeachers: (params?: ScheduleSemesterParams) =>
    addScheduleParams(`${SCHEDULE_API_ROOT}/actual_teachers`, params),

  actualAudiences: (params?: ScheduleSemesterParams) =>
    addScheduleParams(`${SCHEDULE_API_ROOT}/actual_audiences`, params),

  allAudiences: () => `${SCHEDULE_API_ROOT}/all_audiences`,

  allSemesters: () => `${SCHEDULE_API_ROOT}/all_semesters`,

  schedule: (
    scheduleFor: ScheduleFor,
    itemKey: string | number,
    params?: ScheduleSemesterParams,
  ) =>
    addScheduleParams(
      `${SCHEDULE_API_ROOT}/${scheduleFor}/${encodeURIComponent(String(itemKey))}`,
      params,
    ),
};

/**
 * Читает cache-метаданные нового контракта, сохраняя совместимость со старым
 * `isCache` на время обновления всех экземпляров API.
 */
export function getScheduleCacheState(
  response: ScheduleCacheableResponse,
): ScheduleCacheState {
  const ttlSeconds = response.cache?.ttlSeconds;

  return {
    isCached: response.cache?.isCached ?? response.isCache ?? false,
    ttlSeconds:
      typeof ttlSeconds === 'number' &&
      Number.isFinite(ttlSeconds) &&
      ttlSeconds >= 0
        ? ttlSeconds
        : null,
  };
}
