import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useNetworkState } from 'react-use';
import store2 from 'store2';

// import LazyLoadComponent from '../../components/LazyLoad.component';
import { AlertMe } from '@components/AlertMe.component';
import Copyright from '@components/Copyright.component';
import { Routes } from '@/Routes';
// import * as envUtils from '../../utils/env.utils';
// import * as pwaUtils from '../../utils/pwa.utils';
import WithVersionCheckerConnect from '@/shared/WithVersionChecker.util';
import {
  getLegacySchedulePath,
  normalizePathname,
} from '@/shared/schedule-routing.utils';
import appVersion from '@/utils/app-version';

// const PWAInstructionComponent = LazyLoadComponent(
//     React.lazy(() => import('../PWAInstruction/PWAInstruction.component')),
// );

const AppContainer = () => {
  const location = useLocation();
  const state = useNetworkState();

  React.useEffect(() => {
    // pwaUtils.checkPWA();
    store2.set('appVersion', appVersion.version);
  }, []);

  // if (pathname === '/pwa') {
  //     if (window.location.hostname === envUtils.pwaHostname) {
  //         return <PWAInstructionComponent />;
  //     } else {
  //         window.location.href = `https://${envUtils.pwaHostname}`;
  //         return;
  //     }
  // }

  const normalizedPathname = normalizePathname(location.pathname);
  if (normalizedPathname !== location.pathname) {
    return (
      <Navigate
        replace
        to={{
          pathname: normalizedPathname,
          search: location.search,
          hash: location.hash,
        }}
      />
    );
  }

  const legacySchedulePath = getLegacySchedulePath(location);
  if (legacySchedulePath) {
    return <Navigate replace to={legacySchedulePath} />;
  }

  return (
    <>
      {isDev && !state.online && <pre>{JSON.stringify(state, null, 2)}</pre>}
      <AlertMe />
      <Routes />
      <Copyright />
    </>
  );
};

export default WithVersionCheckerConnect(AppContainer);
