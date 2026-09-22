/**
 * Возвращает заголовок пары для календаря. Дополнительная информация заменяет
 * отсутствующее название дисциплины, например, для служебных записей.
 */
export function getScheduleLessonTitle(
  lessonName?: string | null,
  subInfo?: string,
): string {
  return lessonName || subInfo || '...';
}
