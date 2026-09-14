let cooldownUntil = 0;

/** Возвращает оставшееся время общей паузы API в секундах. */
export function getApiRateLimitCooldownSeconds(now = Date.now()): number {
  return Math.max(0, Math.ceil((cooldownUntil - now) / 1e3));
}

/**
 * Блокирует новые запросы API до конца лимита.
 *
 * Возвращает `true`, если время блокировки было продлено. Это позволяет
 * выводить уведомление только для нового ограничения, а не для каждого 429.
 */
export function setApiRateLimitCooldown(
  timeoutSeconds: number,
  now = Date.now(),
): boolean {
  const nextCooldownUntil = now + Math.max(1, timeoutSeconds) * 1e3;

  if (nextCooldownUntil <= cooldownUntil) {
    return false;
  }

  cooldownUntil = nextCooldownUntil;
  return true;
}

/** Используется только в unit-тестах. */
export function resetApiRateLimitCooldown(): void {
  cooldownUntil = 0;
}
