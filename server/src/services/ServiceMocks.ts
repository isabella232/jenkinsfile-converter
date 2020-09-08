import type { ExpressWrapper } from '../ExpressWrapper';
import type * as Amplitude from '@amplitude/node';

const serviceMocks: ExpressWrapper['services'] = {
    VersionNumber: {
        versionNumber: 'jest'
    },
    AmplitudeClient: {
        client: <Amplitude.NodeClient>{},
        logEvent: (event: Amplitude.Event) => {
            void event;
        }
    }
};

export { serviceMocks };
