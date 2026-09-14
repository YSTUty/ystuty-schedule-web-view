const APP_ROUTE_PATTERN =
  /^\/(?:|group(?:\/[^/?#]+)?|teacher(?:\/[^/?#]+)?|by_audience(?:\/[^/?#]+)?|teacher-lessons(?:\/[^/?#]+)?)$/u;

/**
 * Проверяет, что сохранённый путь ведёт только на известную страницу приложения.
 * Это не даёт LocalStorage или CloudStorage перенаправить пользователя наружу.
 */
export function isRestorableAppRoute(value: string | null): value is string {
  return Boolean(value && APP_ROUTE_PATTERN.test(value));
}
