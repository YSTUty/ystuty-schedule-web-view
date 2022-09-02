import React from 'react';
import { useHistory } from 'react-router';
import { useNetworkState } from 'react-use';
import store2 from 'store2';

import LazyLoadComponent from '../../components/LazyLoad.component';
import { AlertMe } from '../../components/AlertMe.component';
import TopPanelComponent from '../../components/TopPanel.component';

import { history } from '../../store';
import * as appConstants from '../../constants/app.constants';
import * as pwaUtils from '../../utils/pwa.utils';
import WithVersionCheckerConnect from '../../shared/WithVersionChecker.util';
import appVersion from '../../utils/app-version';

const PWAInstructionComponent = LazyLoadComponent(
    React.lazy(() => import('../PWAInstruction/PWAInstruction.component'))
);
const ScheduleView = LazyLoadComponent(React.lazy(() => import('../ScheduleView/ScheduleView')));
const TeacherScheduleView = LazyLoadComponent(React.lazy(() => import('../TeacherScheduleView/TeacherScheduleView')));

const App = () => {
    const {
        location: { pathname },
    } = useHistory();
    const state = useNetworkState();

    React.useEffect(() => {
        pwaUtils.checkPWA();
        store2.set('appVersion', appVersion.v);
    }, []);

    if (pathname === '/pwa') {
        if (window.location.hostname === appConstants.pwaHostname) {
            return <PWAInstructionComponent />;
        } else {
            window.location.href = `https://${appConstants.pwaHostname}`;
        }
    } else if (pathname === '/' || pathname === '/g') {
        history.push(`/group${window.location.hash}`);
    } else if (pathname === '/t') {
        history.push(`/teacher${window.location.hash}`);
    }

    const isTeacherPage = pathname.startsWith('/teacher');

    return (
        <>
            {process.env.NODE_ENV === 'development' && !state.online && <pre>{JSON.stringify(state, null, 2)}</pre>}
            <AlertMe />
            <TopPanelComponent forTeacher={isTeacherPage} />

            <hr />
            {isTeacherPage ? <TeacherScheduleView /> : /* isGroup ? */ <ScheduleView />}
        </>
    );
};

export default WithVersionCheckerConnect(App);
