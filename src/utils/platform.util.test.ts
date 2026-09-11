import { describe, expect, it } from 'vitest';

import { detectAppPlatform } from './platform.util';

describe('detectAppPlatform', () => {
  it('uses Telegram launch parameters before other host markers', () => {
    expect(
      detectAppPlatform('?tgWebAppPlatform=ios&vk_app_id=123', false, true),
    ).toBe('telegram');
  });

  it('detects VK launch parameters', () => {
    expect(detectAppPlatform('?vk_platform=mobile_web')).toBe('vk');
  });

  it('falls back to regular web', () => {
    expect(detectAppPlatform('')).toBe('web');
  });
});
