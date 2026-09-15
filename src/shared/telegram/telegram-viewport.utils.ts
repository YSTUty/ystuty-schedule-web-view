export const TELEGRAM_MINI_APP_VIEWPORT_CONTENT =
  'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover';

/**
 * Отключает браузерное масштабирование только внутри Telegram Mini App.
 * Обычная веб-версия сохраняет управление масштабом для доступности.
 */
export function configureTelegramMiniAppViewport(
  rootDocument: Document = document,
): boolean {
  const viewportMeta = rootDocument.querySelector<HTMLMetaElement>(
    'meta[name="viewport"]',
  );
  if (!viewportMeta) {
    return false;
  }

  viewportMeta.content = TELEGRAM_MINI_APP_VIEWPORT_CONTENT;
  return true;
}
