const githubPagesPathQueryParam = '__gh_pages_path';

/**
 * Восстанавливает исходный путь после 404 GitHub Pages.
 *
 * Статический Pages-хостинг не умеет возвращать `index.html` для client-side
 * маршрутов, поэтому `public/404.html` передаёт путь через query-параметр.
 */
export function restoreGitHubPagesPath(): void {
  const currentUrl = new URL(window.location.href);
  const originalPath = currentUrl.searchParams.get(githubPagesPathQueryParam);

  if (
    !originalPath ||
    !originalPath.startsWith('/') ||
    originalPath.startsWith('//')
  ) {
    return;
  }

  const restoredUrl = new URL(originalPath, currentUrl.origin);

  window.history.replaceState(window.history.state, '', restoredUrl);
}
