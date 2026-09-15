import { describe, expect, it } from 'vitest';

import {
  configureTelegramMiniAppViewport,
  TELEGRAM_MINI_APP_VIEWPORT_CONTENT,
} from './telegram-viewport.utils';

describe('configureTelegramMiniAppViewport', () => {
  it('disables page zoom for a Telegram Mini App', () => {
    const viewportMeta = {
      content: 'width=device-width, initial-scale=1',
    } as HTMLMetaElement;
    const rootDocument = {
      querySelector: () => viewportMeta,
    } as unknown as Document;

    expect(configureTelegramMiniAppViewport(rootDocument)).toBe(true);
    expect(viewportMeta.content).toBe(TELEGRAM_MINI_APP_VIEWPORT_CONTENT);
  });

  it('does nothing when a page has no viewport meta tag', () => {
    const rootDocument = {
      querySelector: () => null,
    } as unknown as Document;

    expect(configureTelegramMiniAppViewport(rootDocument)).toBe(false);
  });
});
