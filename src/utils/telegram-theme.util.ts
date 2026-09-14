import type { AppThemePalette } from './app-theme.util';

/**
 * Telegram иногда присылает новый secondary_bg_color после возврата Mini App
 * из фона, не меняя bg_color. В таком случае сохраняем уже принятую поверхность
 * карточек, но не блокируем настоящую смену темы.
 */
export function resolveTelegramThemePalette(
  previous: AppThemePalette | undefined,
  current: AppThemePalette,
): AppThemePalette {
  if (
    !previous?.backgroundDefault ||
    !current.backgroundDefault ||
    previous.backgroundDefault !== current.backgroundDefault
  ) {
    return current;
  }

  return {
    ...current,
    backgroundPaper: previous.backgroundPaper || current.backgroundPaper,
  };
}
