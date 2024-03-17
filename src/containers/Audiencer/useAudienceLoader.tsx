import React from 'react';
import { useDispatch } from 'react-redux';
import store2 from 'store2';

import alertSlice from '../../store/reducer/alert/alert.slice';
import audiencerSlice from '../../store/reducer/audiencer/audiencer.slice';
import { apiPath } from '../../utils';

import { AccumulativeSchedule, IAudienceData } from '../../interfaces/ystuty.types';

const STORE_CACHED_ACCUMULATIVE_KEY = 'STORE_CACHED_ACCUMULATIVE_KEY';

const useAudienceLoader = () => {
    const dispatch = useDispatch();
    const [fetchingAudience, setFetchingAudience] = React.useState(false);
    const [fetchingAcc, setFetchingAcc] = React.useState(false);

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

    const loadAudiences = React.useCallback(() => {
        if (fetchingAudience) {
            return;
        }

        setFetchingAudience(true);

        // TODO: need implement this method
        fetch(`${apiPath}/v1/schedule/audiences`)
            .then((response) => response.json())
            .then((response: { items: IAudienceData[] } | { error: { error: string; message: string } }) => {
                if ('error' in response) {
                    dispatch(
                        alertSlice.actions.add({
                            message: `Error: ${response.error.message}`,
                            severity: 'warning',
                        }),
                    );
                    return;
                }
                applyAudiences(response!.items);
            })
            .catch((e) => {
                applyAudiences(null);
            })
            .finally(() => {
                setFetchingAudience(false);
            });
    }, [fetchingAudience, setFetchingAudience, applyAudiences]);

    const loadAccumulative = React.useCallback(() => {
        if (fetchingAcc) {
            return;
        }

        setFetchingAcc(true);

        // TODO: need implement this method
        fetch(`${apiPath}/v1/schedule/accumulative`)
            .then((response) => response.json())
            .then((response: { items: AccumulativeSchedule[] } | { error: { error: string; message: string } }) => {
                if ('error' in response) {
                    dispatch(
                        alertSlice.actions.add({
                            message: `Error: ${response.error.message}`,
                            severity: 'warning',
                        }),
                    );
                    return;
                }
                applyAccumulative(response!.items);
            })
            .catch((e) => {
                console.error(e);
                applyAccumulative(null);
            })
            .finally(() => {
                setFetchingAcc(false);
            });
    }, [fetchingAcc, setFetchingAcc, applyAccumulative]);

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
