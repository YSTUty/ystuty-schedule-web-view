import type { ScheduleFor } from '@/interfaces/ystuty.types';
import type { RootState } from '@/store';

/** Стабильное пустое значение для экранов, где вид расписания ещё неизвестен. */
export const EMPTY_SCHEDULE_ITEMS: (string | number)[] = [];

/**
 * Не создаёт новый пустой массив при каждом вызове useSelector до определения
 * маршрута. Это сохраняет referential equality в React Redux dev-проверках.
 */
export function selectScheduleItems(
  state: RootState,
  scheduleFor: ScheduleFor | null,
) {
  return scheduleFor
    ? state.schedule.selectedItems[scheduleFor]
    : EMPTY_SCHEDULE_ITEMS;
}
