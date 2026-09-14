// @vitest-environment jsdom

import React from 'react';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import LazyLoadComponent from './LazyLoad.component';

describe('LazyLoadComponent', () => {
  it('shows a placeholder while a component chunk is loading', () => {
    const DeferredComponent = React.lazy(
      () =>
        new Promise<{ default: React.ComponentType }>(() => {
          // Промис намеренно не завершается: проверяется fallback Suspense.
        }),
    );
    const LazyComponent = LazyLoadComponent(DeferredComponent);

    render(<LazyComponent />);

    expect(screen.queryByText('Загрузка…')).not.toBeNull();
  });
});
