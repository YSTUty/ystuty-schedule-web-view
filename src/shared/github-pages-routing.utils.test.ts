// @vitest-environment jsdom
import { afterEach, describe, expect, it } from 'vitest';

import { restoreGitHubPagesPath } from './github-pages-routing.utils';

describe('github-pages-routing.utils', () => {
  afterEach(() => {
    window.history.replaceState(null, '', '/');
  });

  it('restores the original path, query and hash after a Pages 404', () => {
    window.history.replaceState(
      null,
      '',
      '/?__gh_pages_path=%2Fteacher%2F775%3Ffrom%3Dpages%23details',
    );

    restoreGitHubPagesPath();

    expect(window.location.pathname).toBe('/teacher/775');
    expect(window.location.search).toBe('?from=pages');
    expect(window.location.hash).toBe('#details');
  });

  it('does not navigate to an external protocol-relative url', () => {
    window.history.replaceState(null, '', '/?__gh_pages_path=%2F%2Fevil.test');

    restoreGitHubPagesPath();

    expect(window.location.pathname).toBe('/');
    expect(window.location.search).toBe('?__gh_pages_path=%2F%2Fevil.test');
  });
});
