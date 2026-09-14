import { describe, expect, it } from 'vitest';

import { createAppTheme } from './app-theme.util';

describe('createAppTheme', () => {
  it('keeps MUI palette defaults when Telegram colors are absent', () => {
    const theme = createAppTheme('light');

    expect(theme.palette.text.primary).toBeTruthy();
    expect(theme.palette.divider).toBeTruthy();
  });

  it('makes an almost identical dark paper background lighter', () => {
    const theme = createAppTheme('dark', {
      backgroundDefault: '#151515',
      backgroundPaper: '#161616',
    });

    expect(theme.palette.background.paper).not.toBe('#161616');
  });

  it('does not modify an already distinct paper background', () => {
    const theme = createAppTheme('dark', {
      backgroundDefault: '#101010',
      backgroundPaper: '#2f2f2f',
    });

    expect(theme.palette.background.paper).toBe('#2f2f2f');
  });
});
