let cooldownUntil = 0;
const listeners = new Set<() => void>();

export type ApiRateLimitState = {
  expiresAt: number;
  limit?: number;
  remaining?: number;
};

type RateLimitCooldown = {
  resetAfter: number;
  limit?: number;
  remaining?: number;
};

let rateLimitState: ApiRateLimitState | null = null;

function notifyListeners(): void {
  listeners.forEach((listener) => listener());
}

/** Возвращает оставшееся время общей паузы API в секундах. */
export function getApiRateLimitCooldownSeconds(now = Date.now()): number {
  return Math.max(0, Math.ceil((cooldownUntil - now) / 1e3));
}

/** Подписывает UI на появление и обновление глобального rate limit. */
export function subscribeToApiRateLimit(listener: () => void): () => void {
  listeners.add(listener);

  return () => listeners.delete(listener);
}

/** Возвращает последнее ограничение API для отображения пользователю. */
export function getApiRateLimitState(): ApiRateLimitState | null {
  return rateLimitState;
}

/**
 * Блокирует новые запросы API до конца лимита.
 *
 * Возвращает `true`, если время блокировки было продлено. Это позволяет
 * выводить уведомление только для нового ограничения, а не для каждого 429.
 */
export function setApiRateLimitCooldown(
  cooldown: number | RateLimitCooldown,
  now = Date.now(),
): boolean {
  const timeoutSeconds =
    typeof cooldown === 'number' ? cooldown : cooldown.resetAfter;
  const nextCooldownUntil = now + Math.max(1, timeoutSeconds) * 1e3;

  if (nextCooldownUntil <= cooldownUntil) {
    return false;
  }

  cooldownUntil = nextCooldownUntil;
  rateLimitState = {
    expiresAt: cooldownUntil,
    ...(typeof cooldown === 'number'
      ? {}
      : {
          limit: cooldown.limit,
          remaining: cooldown.remaining,
        }),
  };
  notifyListeners();
  return true;
}

/** Скрывает уведомление после окончания лимита или успешного запроса. */
export function clearApiRateLimitState(): void {
  if (!rateLimitState) {
    return;
  }

  rateLimitState = null;
  notifyListeners();
}

/** Используется только в unit-тестах. */
export function resetApiRateLimitCooldown(): void {
  cooldownUntil = 0;
  rateLimitState = null;
  notifyListeners();
}
