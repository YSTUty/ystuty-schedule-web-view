import React from 'react';
import { useHistory } from 'react-router';
import store2 from 'store2';

import LazyLoadComponent from '../../components/LazyLoad.component';

import * as appConstants from '../../constants/app.constants';
import * as deviceUtils from '../../utils/device.utils';
import * as pwaUtils from '../../utils/pwa.utils';
import WithVersionCheckerConnect from '../../shared/WithVersionChecker.util';
import appVersion from '../../utils/app-version';

const PWAInstructionComponent = LazyLoadComponent(
    React.lazy(() => import('../PWAInstruction/PWAInstruction.component'))
);
const ScheduleView = LazyLoadComponent(React.lazy(() => import('../ScheduleView/ScheduleView')));

const App = () => {
    const {
        location: { pathname },
    } = useHistory();

    React.useEffect(() => {
        pwaUtils.checkPWA();
        store2.set('appVersion', appVersion.v);
    }, []);

    if (window.location.hostname === appConstants.pwaHostname) {
        if (!deviceUtils.isPWA()) {
            // return null;
            // TODO: redirect to main domain?
        }

        if (pathname === '/pwa') {
            return <PWAInstructionComponent />;
        }
    }

    return (
        <>
            <ScheduleView />
        </>
    );
};

export default WithVersionCheckerConnect(App);
