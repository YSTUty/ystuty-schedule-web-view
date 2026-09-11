import type { ScheduleFor } from '@/interfaces/ystuty.types';

const schedulePaths: Record<ScheduleFor, string> = {
  group: '/group',
  teacher: '/teacher',
  audience: '/by_audience',
};

const groupSelectionPattern =
  /^[А-ЯЁ]{2,5}-[0-9А-ЯЁ()]{2,8}(?:,[А-ЯЁ]{2,5}-[0-9А-ЯЁ()]{2,8})*$/iu;
const teacherSelectionPattern = /^\d+(?:,\d+)*$/;
const audienceSelectionPattern = /^[^=&/]+(?:,[^=&/]+)*$/u;

type LegacyLocation = Pick<Location, 'hash' | 'pathname' | 'search'>;

/** Убирает повторные слеши из browser path перед сопоставлением маршрутов. */
export function normalizePathname(pathname: string): string {
  return pathname.replace(/\/{2,}/g, '/') || '/';
}

function decodeUrlPart(value: string): string | null {
  try {
    return decodeURIComponent(value);
  } catch {
    return null;
  }
}

function getLegacyHashValue(hash: string): string | null {
  if (!hash.startsWith('#') || hash.length < 2) {
    return null;
  }

  return decodeUrlPart(hash.slice(1));
}

function isValidSelection(scheduleFor: ScheduleFor, value: string): boolean {
  switch (scheduleFor) {
    case 'group':
      return groupSelectionPattern.test(value);
    case 'teacher':
      return teacherSelectionPattern.test(value);
    case 'audience':
      return audienceSelectionPattern.test(value);
  }
}

/**
 * Создаёт канонический URL расписания. Выбранные элементы находятся в path,
 * чтобы хеш был свободен для параметров Telegram и VK Mini Apps.
 */
export function buildSchedulePath(
  scheduleFor: ScheduleFor,
  selectedItems: readonly (string | number)[] = [],
): string {
  const basePath = schedulePaths[scheduleFor];
  const selection = selectedItems.filter(Boolean).join(',');

  return selection ? `${basePath}/${encodeURIComponent(selection)}` : basePath;
}

/** Возвращает элементы расписания, заданные в path нового формата. */
export function getScheduleSelectionFromPathname(
  pathname: string,
  scheduleFor: ScheduleFor,
): string[] {
  const basePath = schedulePaths[scheduleFor];
  const encodedSelection = pathname.startsWith(`${basePath}/`)
    ? pathname.slice(basePath.length + 1)
    : '';
  const selection = decodeUrlPart(encodedSelection);

  return selection?.split(',').filter(Boolean) || [];
}

export function getScheduleForFromPathname(
  pathname: string,
): ScheduleFor | null {
  return (
    (Object.keys(schedulePaths) as ScheduleFor[]).find((scheduleFor) => {
      const basePath = schedulePaths[scheduleFor];
      return pathname === basePath || pathname.startsWith(`${basePath}/`);
    }) || null
  );
}

/**
 * Преобразует старые ссылки вида `/group#ИВТ-12` в новый URL.
 *
 * Хеши, не похожие на прежний формат выбора расписания, игнорируются:
 * они могут принадлежать хост-приложению Telegram или VK.
 */
export function getLegacySchedulePath(
  location: LegacyLocation,
): string | null {
  const { pathname, search } = location;
  const hashSelection = getLegacyHashValue(location.hash);
  const withSearch = (path: string) => `${path}${search}`;
  const buildIfValid = (scheduleFor: ScheduleFor, value: string | null) =>
    value && isValidSelection(scheduleFor, value)
      ? withSearch(buildSchedulePath(scheduleFor, value.split(',')))
      : null;

  if (pathname === '/') {
    return buildIfValid('group', hashSelection);
  }

  const shortGroupMatch = pathname.match(/^\/g(?:\/(.+))?\/?$/iu);
  if (shortGroupMatch) {
    return buildIfValid(
      'group',
      decodeUrlPart(shortGroupMatch[1] || '') || hashSelection,
    );
  }

  const shortTeacherMatch = pathname.match(/^\/t(?:\/(.+))?\/?$/iu);
  if (shortTeacherMatch) {
    return buildIfValid(
      'teacher',
      decodeUrlPart(shortTeacherMatch[1] || '') || hashSelection,
    );
  }

  for (const scheduleFor of Object.keys(schedulePaths) as ScheduleFor[]) {
    if (pathname === schedulePaths[scheduleFor]) {
      const path = buildIfValid(scheduleFor, hashSelection);
      if (path) {
        return path;
      }
    }
  }

  return null;
}
