import React from 'react';
import LoadingComponent from './Loading.component';

const LazyLoadComponent =
    <P extends any>(Component: any, showLoading = false): React.FC<P> =>
    (props: any) =>
        (
            <React.Suspense fallback={showLoading ? <LoadingComponent /> : null}>
                <Component {...props} />
            </React.Suspense>
        );

export default LazyLoadComponent;
