import type { ScheduleFor } from '@/interfaces/ystuty.types';

const schedulePaths: Record<ScheduleFor, string> = {
  group: '/group',
  teacher: '/teacher',
  audience: '/by_audience',
};
const teacherLessonsPath = '/teacher-lessons';

const groupSelectionPattern =
  /^[А-ЯЁ]{2,5}-[0-9А-ЯЁ()]{2,8}(?:,[А-ЯЁ]{2,5}-[0-9А-ЯЁ()]{2,8})*$/iu;
const teacherSelectionPattern = /^\d+(?:,\d+)*$/;
const audienceSelectionPattern = /^[^=&/]+(?:,[^=&/]+)*$/u;

type LegacyLocation = Pick<Location, 'hash' | 'pathname' | 'search'>;

export type SelectionPathRoute = {
  buildPath: (selectedItems: readonly (string | number)[]) => string;
  getSelectionFromPathname: (pathname: string) => string[];
};

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

/** Создаёт URL с выбранными элементами в path, сохраняя hash для хост-приложений. */
export function buildSelectionPath(
  basePath: string,
  selectedItems: readonly (string | number)[] = [],
): string {
  const selection = selectedItems.filter(Boolean).join(',');

  return selection ? `${basePath}/${encodeURIComponent(selection)}` : basePath;
}

/** Возвращает выбранные элементы из path для указанного базового маршрута. */
export function getSelectionFromPathname(
  pathname: string,
  basePath: string,
): string[] {
  const encodedSelection = pathname.startsWith(`${basePath}/`)
    ? pathname.slice(basePath.length + 1)
    : '';
  const selection = decodeUrlPart(encodedSelection);

  return selection?.split(',').filter(Boolean) || [];
}

/**
 * Создаёт канонический URL расписания. Выбранные элементы находятся в path,
 * чтобы хеш был свободен для параметров Telegram и VK Mini Apps.
 */
export function buildSchedulePath(
  scheduleFor: ScheduleFor,
  selectedItems: readonly (string | number)[] = [],
): string {
  return buildSelectionPath(schedulePaths[scheduleFor], selectedItems);
}

/** Возвращает элементы расписания, заданные в path нового формата. */
export function getScheduleSelectionFromPathname(
  pathname: string,
  scheduleFor: ScheduleFor,
): string[] {
  return getSelectionFromPathname(pathname, schedulePaths[scheduleFor]);
}

/** Маршрут выбора преподавателя на странице списка предметов. */
export const teacherLessonsSelectionRoute: SelectionPathRoute = {
  buildPath: (selectedItems) =>
    buildSelectionPath(teacherLessonsPath, selectedItems),
  getSelectionFromPathname: (pathname) =>
    getSelectionFromPathname(pathname, teacherLessonsPath),
};

const teacherScheduleSelectionRoute: SelectionPathRoute = {
  buildPath: (selectedItems) => buildSchedulePath('teacher', selectedItems),
  getSelectionFromPathname: (pathname) =>
    getScheduleSelectionFromPathname(pathname, 'teacher'),
};

/** Определяет целевой маршрут выбора преподавателя по текущей странице. */
export function getTeacherSelectionPathRoute(
  pathname: string,
): SelectionPathRoute {
  return pathname === teacherLessonsPath ||
    pathname.startsWith(`${teacherLessonsPath}/`)
    ? teacherLessonsSelectionRoute
    : teacherScheduleSelectionRoute;
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
 * Преобразует старые ссылки с выбором в hash в новый URL с выбором в path.
 *
 * Хеши, не похожие на прежний формат выбора расписания, игнорируются:
 * они могут принадлежать хост-приложению Telegram или VK.
 */
export function getLegacySchedulePath(location: LegacyLocation): string | null {
  const { pathname, search } = location;
  const hashSelection = getLegacyHashValue(location.hash);
  const withSearch = (path: string) => `${path}${search}`;
  const buildIfValid = (scheduleFor: ScheduleFor, value: string | null) =>
    value && isValidSelection(scheduleFor, value)
      ? withSearch(buildSchedulePath(scheduleFor, value.split(',')))
      : null;

  if (
    pathname === teacherLessonsPath &&
    hashSelection &&
    isValidSelection('teacher', hashSelection)
  ) {
    return withSearch(
      teacherLessonsSelectionRoute.buildPath(hashSelection.split(',')),
    );
  }

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
