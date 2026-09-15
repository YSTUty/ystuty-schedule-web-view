// @vitest-environment jsdom
import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router';

import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import NotFoundPage from './NotFound.page';

describe('NotFoundPage', () => {
  it('explains the missing route and offers a way back home', () => {
    render(
      <IntlProvider locale="ru">
        <MemoryRouter>
          <NotFoundPage />
        </MemoryRouter>
      </IntlProvider>,
    );

    expect(screen.queryByText('Страница не найдена')).not.toBeNull();
    expect(screen.queryByText('Вернуться к расписанию')).not.toBeNull();
  });
});
