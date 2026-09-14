import { describe, expect, it } from 'vitest';

import { resolveTelegramThemePalette } from './telegram-theme.util';

describe('resolveTelegramThemePalette', () => {
  it('keeps the paper color when only Telegram surface colors change', () => {
    expect(
      resolveTelegramThemePalette(
        {
          backgroundDefault: '#2a1d21',
          backgroundPaper: '#2a1d21',
          primary: '#eb6ca4',
        },
        {
          backgroundDefault: '#2a1d21',
          backgroundPaper: '#18222d',
          primary: '#eb6ca4',
        },
      ),
    ).toEqual({
      backgroundDefault: '#2a1d21',
      backgroundPaper: '#2a1d21',
      primary: '#eb6ca4',
    });
  });

  it('adopts all colors after an actual background theme change', () => {
    expect(
      resolveTelegramThemePalette(
        {
          backgroundDefault: '#2a1d21',
          backgroundPaper: '#2a1d21',
        },
        {
          backgroundDefault: '#ffffff',
          backgroundPaper: '#f6f6f6',
        },
      ),
    ).toEqual({
      backgroundDefault: '#ffffff',
      backgroundPaper: '#f6f6f6',
    });
  });
});
