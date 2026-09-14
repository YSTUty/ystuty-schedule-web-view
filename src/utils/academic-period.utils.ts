import dayjs from 'dayjs';

type DateInput = string | Date;

type AcademicPeriodType = 'autumn' | 'spring';

export type AcademicPeriod = {
  id: string;
  label: string;
  startAt: DateInput;
};

type AcademicPeriodDefinition = {
  type: AcademicPeriodType;
  year: number;
};

const periodLabels: Record<
  AcademicPeriodType,
  (year: number) => string
> = {
  autumn: (year) => `Осенний семестр ${year}/${String(year + 1).slice(-2)}`,
  spring: (year) => `Весенний семестр ${year}`,
};

function getAcademicPeriodDefinition(
  value: DateInput,
): AcademicPeriodDefinition | null {
  const date = dayjs(value);

  if (!date.isValid()) {
    return null;
  }

  const month = date.month();
  const year = date.year();

  if (month === 0) {
    return { type: 'autumn', year: year - 1 };
  }

  if (month >= 8) {
    return { type: 'autumn', year };
  }

  return { type: 'spring', year };
}

function getAcademicPeriodId(definition: AcademicPeriodDefinition): string {
  return `${definition.year}-${definition.type}`;
}

/**
 * Возвращает период, которому принадлежит дата занятия.
 *
 * Осенний семестр: сентябрь — январь, весенний: февраль — август.
 */
export function getAcademicPeriodForDate(
  value: DateInput | undefined,
): AcademicPeriod | null {
  if (!value) {
    return null;
  }

  const definition = getAcademicPeriodDefinition(value);

  if (!definition) {
    return null;
  }

  return {
    id: getAcademicPeriodId(definition),
    label: periodLabels[definition.type](definition.year),
    startAt: value,
  };
}

/** Собирает доступные периоды по фактически загруженным занятиям. */
export function getAvailableAcademicPeriods(
  lessons: readonly { startAt?: DateInput }[],
): AcademicPeriod[] {
  const periods = new Map<string, AcademicPeriod>();

  for (const lesson of lessons) {
    const period = getAcademicPeriodForDate(lesson.startAt);

    if (!period || periods.has(period.id)) {
      continue;
    }

    periods.set(period.id, period);
  }

  return [...periods.values()].sort(
    (left, right) =>
      dayjs(right.startAt).valueOf() - dayjs(left.startAt).valueOf(),
  );
}

/**
 * Выбирает текущий период, если он есть в данных; иначе самый поздний.
 */
export function getDefaultAcademicPeriodId(
  periods: readonly AcademicPeriod[],
  now: DateInput = new Date(),
): string | undefined {
  const currentPeriodId = getAcademicPeriodForDate(now)?.id;

  return (
    periods.find((period) => period.id === currentPeriodId)?.id ??
    periods[0]?.id
  );
}

/** Оставляет занятия выбранного учебного периода. */
export function filterByAcademicPeriod<
  T extends { startAt?: DateInput },
>(lessons: readonly T[], periodId: string | undefined): T[] {
  if (!periodId) {
    return [...lessons];
  }

  return lessons.filter(
    (lesson) => getAcademicPeriodForDate(lesson.startAt)?.id === periodId,
  );
}
