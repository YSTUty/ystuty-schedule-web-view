import * as React from 'react';
import { useIntl } from 'react-intl';
import { useLocation, useNavigate } from 'react-router';
// import { useNetworkState } from 'react-use';
import { toast } from 'react-toastify';

// import { useAppSelector } from '@/store';
import { apiPath } from '@/utils';
import {
  clearApiRateLimitState,
  getApiRateLimitCooldownSeconds,
  setApiRateLimitCooldown,
} from './api.rate-limit.utils';
import {
  getRateLimitInfo,
  getResponseError,
  getUnexpectedResponseMessage,
  isAbortError,
} from './api.response.utils';
import type { ApiFetchParams, ApiFetchResult } from './api.types';
import { buildApiUrl } from './api.utils';

export type {
  ApiFetchParams,
  ApiFetchResult,
  ResponseError,
  ValidationItem,
} from './api.types';

export const useApi = () => {
  // const { accessToken } = useAppSelector((e) => e.app);
  const location = useLocation();
  const navigate = useNavigate();
  const { formatMessage } = useIntl();
  // const { online } = useNetworkState();

  const [isFetching, setIsFetching] = React.useState<Record<string, boolean>>(
    {},
  );
  const controllers = React.useRef<Record<string, AbortController>>({});
  const nodeTimeouts = React.useRef<ReturnType<typeof setTimeout>[]>([]);
  const isFetchingRef = React.useRef(isFetching);
  const isMountedRef = React.useRef(false);

  const isFetchingAny = React.useMemo(
    () => Object.values(isFetching).some(Boolean),
    [isFetching],
  );

  /** Синхронно блокирует повторный запрос до следующего React-рендера. */
  function updateFetchingState(fKey: string, value: boolean) {
    const nextIsFetching = { ...isFetchingRef.current };

    if (value) {
      nextIsFetching[fKey] = true;
    } else {
      delete nextIsFetching[fKey];
    }

    isFetchingRef.current = nextIsFetching;

    if (isMountedRef.current) {
      setIsFetching(nextIsFetching);
    }
  }

  function apiFetch<T = unknown>(
    path: string,
    init?: RequestInit,
    params: ApiFetchParams = {},
  ): Promise<ApiFetchResult<T>> {
    const {
      fKey = path,
      noRenavigate,
      checkError,
      noAlert,
      setError,
      handleError,
      handleRateLimit,
      returnResponse,
    } = params;

    if (!isMountedRef.current || isFetchingRef.current[fKey]) {
      return Promise.resolve(null);
    }

    // Один лимит API распространяется на параллельные загрузчики страницы.
    if (getApiRateLimitCooldownSeconds() > 0) {
      return Promise.resolve(null);
    }

    const controller = new AbortController();
    updateFetchingState(fKey, true);
    controllers.current[fKey] = controller;

    const reportUnexpectedResponse = (response: Response) => {
      const message = getUnexpectedResponseMessage(response, formatMessage);

      if (setError) {
        setError(message);
        return null;
      }

      throw message;
    };

    const reportRateLimit = (response: Response) => {
      const rateLimit = getRateLimitInfo(response.headers);
      const isCooldownExtended = setApiRateLimitCooldown(rateLimit);
      const details = [
        rateLimit.limit !== undefined && `лимит: ${rateLimit.limit}`,
        rateLimit.remaining !== undefined && `осталось: ${rateLimit.remaining}`,
      ]
        .filter(Boolean)
        .join(', ');
      const baseMessage = formatMessage(
        { id: 't.api.rate_limit.retry' },
        { retryAfter: rateLimit.resetAfter },
      );
      const message = details ? `${baseMessage} (${details})` : baseMessage;

      const isHandled =
        typeof handleRateLimit === 'function' &&
        handleRateLimit(rateLimit.resetAfter);

      if (!isHandled && isCooldownExtended) {
        if (setError) {
          setError(message);
        } else {
          toast.warning(message, {
            autoClose: Math.max(2, rateLimit.resetAfter) * 1e3,
            toastId: 'api-rate-limit',
          });
        }
      }

      return null;
    };

    return fetch(buildApiUrl(apiPath, path), {
      method: 'GET',
      ...init,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        // Authorization: `Bearer ${accessToken}`,
        ...init?.headers,
      },
    })
      .then(async (response) => {
        if (response.status === 429) {
          return reportRateLimit(response);
        }

        if (response.ok && getApiRateLimitCooldownSeconds() === 0) {
          clearApiRateLimitState();
        }

        if (returnResponse) {
          return response;
        }

        let data: T;
        try {
          data = (await response.json()) as T;
        } catch {
          return reportUnexpectedResponse(response);
        }

        if (response.ok) {
          return { data };
        }

        if (!setError && !checkError) {
          throw data;
        }

        const error = getResponseError(data);
        if (!error) {
          return reportUnexpectedResponse(response);
        }

        if (error.code === 503) {
          const message =
            error.message !== 'Service Unavailable'
              ? error.message
              : formatMessage({ id: 't.api.service_unavailable' });
          setError?.(message);

          if (!noAlert) {
            const delay = 2e3;
            const timeout = setTimeout(() => alert(message), delay + 10);
            nodeTimeouts.current.push(timeout);
            await new Promise((resolve) => setTimeout(resolve, delay));
          }

          if (location.pathname !== '/' && !noRenavigate) {
            navigate(
              {
                pathname: '/',
                search: location.search,
                hash: location.hash,
              },
              { replace: true },
            );
          }
          return { error };
        }

        if (/* error.code === 403 || */ error.message === 'Token is revoked') {
          navigate(
            {
              pathname: '/auth/logout',
              search: location.search,
              hash: location.hash,
            },
            { replace: true },
          );
          return null;
        }

        const message =
          error.message || formatMessage({ id: 't.api.server_error' });
        // const { validation } = error;
        // TODO: `validation` ?
        setError?.(message);
        handleError?.(error);
        return { error };
      })
      .catch((error: unknown) => {
        if (isAbortError(error)) {
          // Отменённый запрос не должен оставлять вызывающий код в ожидании.
          return null;
        }

        throw error;
      })
      .finally(() => {
        if (controllers.current[fKey] === controller) {
          delete controllers.current[fKey];
          updateFetchingState(fKey, false);
        }
      });
  }

  React.useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      Object.values(controllers.current).forEach((controller) =>
        controller.abort('Canceled fetch'),
      );
      isFetchingRef.current = {};
      for (const nodeTimeout of nodeTimeouts.current) {
        clearTimeout(nodeTimeout);
      }
      nodeTimeouts.current = [];
    };
  }, []);

  return [apiFetch, isFetchingAny, isFetching, controllers] as const;
};
