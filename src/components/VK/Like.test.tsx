// @vitest-environment jsdom
import React from 'react';

import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import Like from './Like';
import VKContext from './VKContext';

describe('Like', () => {
  it('initializes a VK counter once in React StrictMode', () => {
    const likeWidget = vi.fn();
    const vk = {
      Widgets: { Like: likeWidget },
      Observer: {
        subscribe: vi.fn(),
        unsubscribe: vi.fn(),
      },
    };

    render(
      <React.StrictMode>
        <VKContext.Provider value={vk}>
          <Like elementId="vk_like_test" />
        </VKContext.Provider>
      </React.StrictMode>,
    );

    expect(likeWidget).toHaveBeenCalledTimes(1);
  });
});
