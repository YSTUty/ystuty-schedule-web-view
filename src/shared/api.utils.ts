/**
 * Собирает URL endpoint'а относительно базового адреса API.
 *
 * Endpoint намеренно ограничен относительным путём: API-клиент не должен
 * незаметно отправить запрос на другой хост из-за значения в вызывающем коде.
 */
export function buildApiUrl(apiBaseUrl: string, endpoint: string) {
  if (/^(?:[a-z][a-z\d+.-]*:)?\/\//i.test(endpoint)) {
    throw new TypeError('API endpoint must be a relative path');
  }

  const normalizedEndpoint = endpoint.replace(/^\/+/, '');
  const baseUrl = new URL(`${apiBaseUrl.replace(/\/+$/, '')}/`);
  const apiUrl = new URL(normalizedEndpoint, baseUrl);

  if (!apiUrl.pathname.startsWith(baseUrl.pathname)) {
    throw new TypeError('API endpoint must not leave the API base path');
  }

  return apiUrl.href;
}
