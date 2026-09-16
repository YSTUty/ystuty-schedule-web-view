import { LessonData } from '@/interfaces/schedule';

/**
 * Дополнительные данные для нескольких вариантов одной пары по подгруппам.
 * Появляются только у объединённых последовательностей из четырёх и более пар.
 */
export type MergedLessonData = LessonData & {
  mergedTeacherNames?: string[];
  mergedVariantsCount?: number;
};

const MASS_VARIANTS_MIN_COUNT = 4;

const uniqueNonEmpty = (values: Array<string | null | undefined>) => [
  ...new Set(values.filter((value): value is string => Boolean(value?.trim()))),
];

const getTeacherNames = (lesson: LessonData) =>
  uniqueNonEmpty([lesson.teacherName, lesson.additionalTeacherName]);

/**
 * Проверяет поля, которые определяют одну пару. Преподаватели и группы
 * намеренно не сравниваются: именно они обычно различаются у подгрупп.
 */
const isSameLessonVariant = (first: LessonData, second: LessonData) =>
  first.number === second.number &&
  first.timeRange === second.timeRange &&
  first.start === second.start &&
  first.end === second.end &&
  first.title === second.title &&
  first.type === second.type &&
  first.auditoryName === second.auditoryName &&
  first.additionalAuditoryName === second.additionalAuditoryName &&
  Boolean(first.isDistant) === Boolean(second.isDistant);

const mergeMassVariants = (variants: LessonData[]): MergedLessonData => {
  const [first] = variants;

  return {
    ...first,
    // Объединённая запись должна оставаться полезной во всех текущих представлениях.
    groups: uniqueNonEmpty(variants.flatMap((lesson) => lesson.groups ?? [])),
    isDivision: true,
    mergedTeacherNames: uniqueNonEmpty(variants.flatMap(getTeacherNames)),
    mergedVariantsCount: variants.length,
  };
};

/**
 * Объединяет только соседние массовые варианты одной пары. Небольшие наборы
 * из двух-трёх записей сохраняются, чтобы не терять читаемую детализацию.
 */
export const mergeMassLessonVariants = (
  lessons: LessonData[],
): MergedLessonData[] => {
  const result: MergedLessonData[] = [];
  let variants: LessonData[] = [];

  const appendVariants = () => {
    if (variants.length >= MASS_VARIANTS_MIN_COUNT) {
      result.push(mergeMassVariants(variants));
    } else {
      result.push(...variants);
    }
    variants = [];
  };

  for (const lesson of lessons) {
    if (variants.length > 0 && !isSameLessonVariant(variants[0], lesson)) {
      appendVariants();
    }
    variants.push(lesson);
  }

  if (variants.length > 0) {
    appendVariants();
  }

  return result;
};
