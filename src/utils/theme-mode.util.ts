export type ThemeMode = 'light' | 'dark';

export const THEME_MODE_STORAGE_KEY = 'themeMode';

/** Нормализует сохранённое значение режима темы. */
export function toThemeMode(value: unknown): ThemeMode | null {
  return value === 'light' || value === 'dark' ? value : null;
}
