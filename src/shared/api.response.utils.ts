import type { ResponseError } from './api.types';

type FormatMessage = (
  descriptor: { id: string },
  values?: Record<string, number>,
) => string;

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object';
}

/** Возвращает нормализованную API-ошибку только для ожидаемого формата ответа. */
export function getResponseError(payload: unknown): ResponseError | undefined {
  if (!isRecord(payload) || !isRecord(payload.error)) {
    return undefined;
  }

  const error = payload.error;
  const code = typeof error.code === 'number' ? error.code : 0;
  const message = typeof error.message === 'string' ? error.message : '';

  if (!code && !message) {
    return undefined;
  }

  return {
    code,
    error: typeof error.error === 'string' ? error.error : '',
    message,
    validation: Array.isArray(error.validation)
      ? (error.validation as ResponseError['validation'])
      : undefined,
    payload: error.payload,
  };
}

/** Проверяет отмену fetch без привязки к конкретной реализации AbortController. */
export function isAbortError(error: unknown) {
  return (
    error === 'Canceled fetch' ||
    (isRecord(error) && error.name === 'AbortError')
  );
}

/**
 * Преобразует Retry-After в секунды. Поддерживаются число секунд и HTTP-дата.
 */
export function getRetryAfterSeconds(
  retryAfterHeader: string | null,
  now = Date.now(),
) {
  if (!retryAfterHeader) {
    return 1;
  }

  const seconds = Number(retryAfterHeader);
  if (Number.isFinite(seconds) && seconds >= 0) {
    return seconds;
  }

  const retryAt = Date.parse(retryAfterHeader);
  return Number.isNaN(retryAt)
    ? 1
    : Math.max(0, Math.ceil((retryAt - now) / 1e3));
}

export type RateLimitInfo = {
  limit?: number;
  remaining?: number;
  resetAfter: number;
};

function getRateLimitNumber(value: string | null): number | undefined {
  if (value === null) {
    return undefined;
  }

  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : undefined;
}

/**
 * Возвращает время до сброса лимита. Поддерживает относительные секунды и
 * Unix timestamp в секундах или миллисекундах.
 */
export function getRateLimitResetSeconds(
  resetHeader: string | null,
  now = Date.now(),
): number | undefined {
  const reset = getRateLimitNumber(resetHeader);

  if (reset === undefined) {
    return undefined;
  }

  if (reset > 1e11) {
    return Math.max(0, Math.ceil((reset - now) / 1e3));
  }

  if (reset > 1e9) {
    return Math.max(0, Math.ceil(reset - now / 1e3));
  }

  return Math.ceil(reset);
}

/** Читает стандартные и используемые Schedule API заголовки rate limit. */
export function getRateLimitInfo(
  headers: Headers,
  now = Date.now(),
): RateLimitInfo {
  const retryAfter = headers.get('Retry-After');
  const resetAfter =
    (retryAfter ? getRetryAfterSeconds(retryAfter, now) : undefined) ??
    getRateLimitResetSeconds(headers.get('X-RateLimit-Reset'), now) ??
    1;

  return {
    limit: getRateLimitNumber(headers.get('X-RateLimit-Limit')),
    remaining: getRateLimitNumber(headers.get('X-RateLimit-Remaining')),
    resetAfter,
  };
}

/** Возвращает понятное сообщение, если API ответил не JSON-ошибкой. */
export function getUnexpectedResponseMessage(
  response: Response,
  formatMessage: FormatMessage,
) {
  if (response.ok) {
    return 'Failed parse json';
  }

  return response.status === 500
    ? formatMessage({ id: 't.api.server_unavailable' })
    : formatMessage({ id: 't.api.server_error' });
}
