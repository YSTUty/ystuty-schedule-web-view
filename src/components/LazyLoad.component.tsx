import React from 'react';

import LoadingComponent from './Loading.component';

const LazyLoadComponent =
  <P extends object>(
    Component: React.ComponentType<P>,
    showLoading = true,
  ): React.FC<P> =>
  (props) => (
    <React.Suspense
      fallback={
        showLoading ? <LoadingComponent>Загрузка…</LoadingComponent> : null
      }>
      <Component {...props} />
    </React.Suspense>
  );

export default LazyLoadComponent;
