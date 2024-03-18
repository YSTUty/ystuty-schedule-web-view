import React from 'react';
import { useLocation } from 'react-router';
import { useNetworkState } from 'react-use';
import store2 from 'store2';

import LazyLoadComponent from '../../components/LazyLoad.component';
import { AlertMe } from '../../components/AlertMe.component';
import Copyright from '../../components/Copyright.component';
import { Routes } from '../../Routes';

import { history } from '../../store';
import * as envUtils from '../../utils/env.utils';
import * as pwaUtils from '../../utils/pwa.utils';
import WithVersionCheckerConnect from '../../shared/WithVersionChecker.util';
import appVersion from '../../utils/app-version';

const PWAInstructionComponent = LazyLoadComponent(
    React.lazy(() => import('../PWAInstruction/PWAInstruction.component')),
);

const AppContainer = () => {
    const { pathname, hash } = useLocation();
    const state = useNetworkState();

    React.useEffect(() => {
        pwaUtils.checkPWA();
        store2.set('appVersion', appVersion.v);
    }, []);

    if (pathname === '/pwa') {
        if (window.location.hostname === envUtils.pwaHostname) {
            return <PWAInstructionComponent />;
        } else {
            window.location.href = `https://${envUtils.pwaHostname}`;
            return;
        }
    }

    // TODO: Переделать наоборот из hash в href
    const regexpGroup = /^\/(g\/?|group\/)(?<groupName>[А-я]{2,5}-[0-9А-я()]{2,8})?$/i;
    const groupRes = pathname.match(regexpGroup);

    // * Short paths
    if ((pathname === '/' && hash.length > 1) /* for compatibility support */ || groupRes) {
        history.push(`/group${groupRes?.groups?.groupName ? `#${groupRes.groups.groupName}` : window.location.hash}`);
    } else if (/^\/t\/?$/i.test(pathname)) {
        history.push(`/teacher${window.location.hash}`);
    }

    return (
        <>
            {process.env.NODE_ENV === 'development' && !state.online && <pre>{JSON.stringify(state, null, 2)}</pre>}
            <AlertMe />
            <Routes />
            <Copyright />
        </>
    );
};

export default WithVersionCheckerConnect(AppContainer);
