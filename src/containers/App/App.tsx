import React from 'react';
import { useHistory } from 'react-router';
import store2 from 'store2';

import LazyLoadComponent from '../../components/LazyLoad.component';
import { AlertMe } from '../../components/AlertMe.component';

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
    }

    return (
        <>
            <AlertMe />
            {pathname.startsWith('/teacher') ? <TeacherScheduleView /> : <ScheduleView />}
        </>
    );
};

export default WithVersionCheckerConnect(App);
