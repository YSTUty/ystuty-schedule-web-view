import { describe, expect, it } from 'vitest';

import {
  getEnvUnsupportedState,
  resolveEnvUnsupportedTheme,
} from './EnvUnsupported.component';

describe('getEnvUnsupportedState', () => {
  it('shows the offline state only when the browser reports no network', () => {
    expect(getEnvUnsupportedState(undefined, false)).toBe('offline');
    expect(getEnvUnsupportedState(new Error('Failed to render'), false)).toBe(
      'offline',
    );
  });

  it('does not confuse application errors with network failures', () => {
    expect(getEnvUnsupportedState(new Error('Failed to render'), true)).toBe(
      'runtime-error',
    );
  });

  it('uses the unsupported state when bootstrap provides no error', () => {
    expect(getEnvUnsupportedState(undefined, true)).toBe('unsupported');
  });
});

describe('resolveEnvUnsupportedTheme', () => {
  it('keeps the active application theme after an ErrorBoundary fallback', () => {
    expect(resolveEnvUnsupportedTheme('dark', 'light', false)).toBe('dark');
  });

  it('uses a saved setting before the browser preference', () => {
    expect(resolveEnvUnsupportedTheme(undefined, 'light', true)).toBe('light');
  });

  it('falls back to the system preference for a first-time visitor', () => {
    expect(resolveEnvUnsupportedTheme(undefined, null, true)).toBe('dark');
  });
});
