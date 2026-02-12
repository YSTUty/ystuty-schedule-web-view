import * as React from 'react';
import { useIntl } from 'react-intl';
import { useLocation } from 'react-router';
// import { useNetworkState } from 'react-use';
import { toast } from 'react-toastify';

import { history /* , useAppSelector */ } from '../store';
import { apiPath } from '../utils';

export type ValidationItem = {
    children: ValidationItem[];
    constraints: Record<string, string>;
    isDate: string;
    property: string;
};

export type ResponseError = {
    code: number;
    error: string;
    message: string;
    validation?: ValidationItem[];
    payload?: any;
};

export const useApi = () => {
    // const { accessToken } = useAppSelector((e) => e.app);
    const { pathname } = useLocation();
    const { formatMessage } = useIntl();
    // const { online } = useNetworkState();

    const [isFetching, setIsFetching] = React.useState<Record<string, boolean>>({});
    const controllers = React.useRef<Record<string, AbortController>>({});
    const nodeTimeouts = React.useRef<NodeJS.Timeout[]>([]);
    const isFetchingRef = React.useRef(isFetching);

    const isFetchingAny = React.useMemo(() => Object.values(isFetching).some(Boolean), [isFetching]);

    function apiFetch<T = any>(
        path: string,
        init?: RequestInit,
        params: {
            fKey?: string;
            fKeySub?: string;
            returnResponse?: boolean;
            checkError?: boolean;
            noAlert?: boolean;
            noRenavigate?: boolean;
            setError?: (error: string) => void;
            handleError?: (error: ResponseError) => boolean | void;
            handleRateLimit?: false | ((timeout: number) => boolean | void);
        } = {},
    ) {
        const {
            fKey = path,
            fKeySub = path,
            noRenavigate,
            checkError,
            noAlert,
            setError,
            handleError,
            handleRateLimit = (retryAfter) =>
                // toast.promise(delay(retryAfter * 1e3), {
                //     pending: formatMessage({ id: 't.api.rate_limit.retry' }, { retryAfter }),
                //     success: 'Можно повторить запрос',
                // }),
                (
                    toast.warning(formatMessage({ id: 't.api.rate_limit.retry' }, { retryAfter }), {
                        autoClose: Math.max(2, retryAfter) * 1e3,
                    }),
                    true
                ),
            returnResponse,
        } = params;

        const controller = new AbortController();

        if (!isFetching[fKey]) {
            // if (!isFetchingRef.current[fkey]) {
            controllers.current[fKey] = controller;
        }

        const promise = new Promise<
            | {
                  error: {
                      code: number;
                      error: string;
                      message: string;
                      validation?: ValidationItem[];
                      payload?: any;
                  };
              }
            | { data: T }
            | Response
            | null
        >((resolve, reject) =>
            Promise.resolve()
                .then(() => {
                    if (isFetchingRef.current[fKey]) {
                        return null;
                    }
                    setIsFetching((e) => ({ ...e, [fKey]: true }));
                    controllers.current[fKey] = controller;
                    return true;
                })
                .then(
                    (allow) =>
                        allow &&
                        fetch(`${apiPath}/${path}`, {
                            method: 'GET',
                            ...init,
                            signal: controller.signal,
                            headers: {
                                'Content-Type': 'application/json',
                                // Authorization: `Bearer ${accessToken}`,
                                ...init?.headers,
                            },
                        }),
                )
                .then(async (response) => {
                    if (!response || returnResponse) {
                        return response;
                    }

                    try {
                        const data = (await response.json()) as T;
                        if (response.ok) {
                            return { data };
                        }

                        if (!setError && !checkError) {
                            reject(data);
                            return null;
                        }

                        const { error } = data as { error?: ResponseError };
                        if (!error) {
                            throw new Error('Failed get error data');
                        }
                        if (error.message || error.code) {
                            if (error.code === 503) {
                                let msg =
                                    error.message !== 'Service Unavailable'
                                        ? error.message
                                        : formatMessage({ id: 't.api.service_unavailable' });
                                setError?.(msg);

                                if (!noAlert) {
                                    const delay = 2e3;
                                    const timeout = setTimeout(() => alert(msg), delay + 10);
                                    nodeTimeouts.current.push(timeout);
                                    await new Promise((r) => setTimeout(r, delay));
                                }

                                if (pathname !== '/' && !noRenavigate) {
                                    history.replace('/');
                                }
                                return { error };
                            }
                            if (error.code === 429) {
                                let retryAfter = Number(response.headers.get('Retry-After'));
                                (handleRateLimit && handleRateLimit(retryAfter)) ||
                                    setError?.(formatMessage({ id: 't.api.rate_limit.retry' }, { retryAfter }));
                            } else if (/* error.code === 403 || */ error.message === 'Token is revoked') {
                                history.replace('/auth/logout');
                                return null;
                            } else {
                                let msg = error.message || formatMessage({ id: 't.api.server_error' });
                                // const { validation } = error;
                                // TODO: `validation` ?
                                setError?.(msg);
                                handleError?.(error);
                                return { error };
                            }
                        } else if (!response.ok) {
                            throw new Error(formatMessage({ id: 't.api.response_not_ok' }));
                        } else {
                            throw new Error(formatMessage({ id: 't.api.whats_wrong' }));
                        }
                        return null;
                    } catch (err) {
                        let msg = 'Failed parse json';
                        if (!response.ok) {
                            if (response.status === 500) {
                                msg = formatMessage({ id: 't.api.server_unavailable' });
                            } else {
                                msg = formatMessage({ id: 't.api.server_error' });
                            }
                        }

                        if (!setError) {
                            reject(msg);
                        } else {
                            setError(msg);
                        }
                        return null;
                    }
                })
                .then(resolve)
                .catch((err) => {
                    if (err.name !== 'AbortError' && err !== 'Canceled fetch') {
                        reject(err);
                    }
                })
                .finally(() => {
                    setIsFetching((e) => ({ ...e, [fKey]: false }));
                    // setIsFetching(({ [fKey]: _del, ...rest }) => rest);
                    delete controllers.current[fKey];
                }),
        );

        return promise;
    }

    React.useEffect(() => {
        return () => {
            Object.values(controllers.current).map((c) => c.abort('Canceled fetch'));
            setIsFetching({});
            for (const nodeTimeout of nodeTimeouts.current) {
                clearTimeout(nodeTimeout);
            }
        };
    }, [controllers]);

    React.useEffect(() => {
        isFetchingRef.current = isFetching;
    }, [isFetching]);

    return [apiFetch, isFetchingAny, isFetching, controllers] as const;
};
