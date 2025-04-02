import React from 'react';
import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import { toast } from 'react-toastify';
import store2 from 'store2';

import alertSlice from '../../store/reducer/alert/alert.slice';
import audiencerSlice from '../../store/reducer/audiencer/audiencer.slice';
import { useApi } from '../../shared/api.hook';

import { AccumulativeSchedule, IAudienceData } from '../../interfaces/ystuty.types';

const STORE_CACHED_ACCUMULATIVE_KEY = 'STORE_CACHED_ACCUMULATIVE_KEY';

const useAudienceLoader = () => {
    const dispatch = useDispatch();
    const { formatMessage } = useIntl();
    const [fetchApi, , isFetchings] = useApi();

    // const [audiences, setAudiences] = React.useState<IAudienceData[]>([]);
    // const [accumulative, setAccumulative] = React.useState<AccumulativeSchedule[]>([]);

    const applyAudiences = React.useCallback((items: IAudienceData[] | null) => {
        if (!items) {
            return;
        }

        items.sort((a, b) => {
            const [a1, a2] = a.name.split('-');
            const [b1, b2] = b.name.split('-');
            if (a1 === b1) {
                const a2n = Number(a2);
                const b2n = Number(b2);
                if (isNaN(a2n) || isNaN(b2n)) {
                    return a2.localeCompare(b2);
                }
                return a2n - b2n;
            }
            return a1.localeCompare(b1);
        });

        dispatch(audiencerSlice.actions.setAudiences(items));
        // setAudiences(items);
    }, []);

    const applyAccumulative = React.useCallback((items: AccumulativeSchedule[] | null) => {
        if (!items) {
            items = store2.get(STORE_CACHED_ACCUMULATIVE_KEY, null);
            if (!items) {
                return;
            }
        }
        // else if (items.length > 0) {
        //     try {
        //         store2.set(STORE_CACHED_ACCUMULATIVE_KEY, items);
        //     } catch (err) {
        //         console.error(err);
        //     }
        // }

        items.sort((a, b) => {
            const [a1, a2] = a.name.split('-');
            const [b1, b2] = b.name.split('-');
            if (a1 === b1) {
                const a2n = Number(a2);
                const b2n = Number(b2);
                if (isNaN(a2n) || isNaN(b2n)) {
                    return a2.localeCompare(b2);
                }
                return a2n - b2n;
            }
            return a1.localeCompare(b1);
        });

        dispatch(audiencerSlice.actions.setAccumulative(items));
        // setAccumulative(items);
    }, []);

    const loadAudiences = React.useCallback(async () => {
        if (isFetchings['actual_audiences']) return;

        try {
            const response = await fetchApi<{ isCache: boolean; items: IAudienceData[]; count: number }>(
                `v1/schedule/actual_audiences`,
                {},
                {
                    fKey: 'actual_audiences',
                    setError: (message) =>
                        dispatch(
                            alertSlice.actions.add({
                                message: `Error: ${message}`,
                                severity: 'warning',
                            }),
                        ),
                },
            );

            if (!response || 'error' in response || !('data' in response)) {
                return;
            }

            applyAudiences(response.data.items);
        } catch (err) {
            // ??
            applyAudiences(null);
            toast.warning('Ошибка загрузки аудиторий');
        }
    }, [applyAudiences]);

    const loadAccumulative = React.useCallback(async () => {
        if (isFetchings['accumulative']) return;

        // TODO: need implement this method
        try {
            const response = await fetchApi<{ items: AccumulativeSchedule[] }>(
                `v1/schedule/accumulative`,
                {},
                {
                    fKey: 'accumulative',
                    setError: (message) =>
                        dispatch(
                            alertSlice.actions.add({
                                message: `Error: ${message}`,
                                severity: 'warning',
                            }),
                        ),
                },
            );
            if (!response || 'error' in response || !('data' in response)) {
                return;
            }

            applyAccumulative(response.data.items);
        } catch (err) {
            console.error(err);
            // ??
            applyAccumulative(null);
            toast.warning('Ошибка загрузки аудиторий #2');
        }
    }, [applyAccumulative]);

    React.useEffect(() => {
        loadAudiences();

        // if (store2.get(STORE_CACHED_ACCUMULATIVE_KEY, null)) {
        //     applyAccumulative(null);
        // } else {
        loadAccumulative();
        // }
    }, []);

    return {};
};

export default useAudienceLoader;
