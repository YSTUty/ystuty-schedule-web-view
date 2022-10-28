import React from 'react';
import { Route, Switch, useLocation } from 'react-router';
import { useNetworkState } from 'react-use';
import store2 from 'store2';

import LazyLoadComponent from '../../components/LazyLoad.component';
import { AlertMe } from '../../components/AlertMe.component';
import Copyright from '../../components/Copyright.component';

import { history } from '../../store';
import * as envUtils from '../../utils/env.utils';
import * as pwaUtils from '../../utils/pwa.utils';
import WithVersionCheckerConnect from '../../shared/WithVersionChecker.util';
import appVersion from '../../utils/app-version';

const App = LazyLoadComponent(React.lazy(() => import('../App/App.container')));
const PWAInstructionComponent = LazyLoadComponent(
    React.lazy(() => import('../PWAInstruction/PWAInstruction.component')),
);
const Schedule = LazyLoadComponent(React.lazy(() => import('../Schedule/Schedule')));
const Audiencer = LazyLoadComponent(React.lazy(() => import('../Audiencer/Audiencer')));
const TeacherLessons = LazyLoadComponent(React.lazy(() => import('../TeacherLessons/TeacherLessons')));

const Routes = () => {
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
        }
    }
    // * Short paths
    else if ((pathname === '/' && hash.length > 1) /* for compatibility support */ || pathname === '/g') {
        history.push(`/group${window.location.hash}`);
    } else if (pathname === '/t') {
        history.push(`/teacher${window.location.hash}`);
    }

    return (
        <>
            {process.env.NODE_ENV === 'development' && !state.online && <pre>{JSON.stringify(state, null, 2)}</pre>}
            <AlertMe />

            <Switch>
                <Route exact path="/" component={App} />
                <Route strict path="/(group|teacher)" component={Schedule} />
                <Route path="/audience" component={Audiencer} />
                <Route path="/teacher-lessons" component={TeacherLessons} />
                <Route component={() => <b>not found</b>} />
            </Switch>
            <Copyright />
        </>
    );
};

export default WithVersionCheckerConnect(Routes);
