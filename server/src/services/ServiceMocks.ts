import type { ExpressWrapper } from '../ExpressWrapper';
import type * as Amplitude from '@amplitude/node';
import type { AmplitudeClientService } from './AmplitudeClientService';
import type { ConfigStorageClientService } from './ConfigStorageClientService';

const serviceMocks: ExpressWrapper['services'] = {
    VersionNumber: {
        versionNumber: 'jest'
    },
    AmplitudeClient: <AmplitudeClientService>{
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        logEvent: (event: Amplitude.Event) => {
            return;
        }
    },
    ConfigStorageClient: <ConfigStorageClientService>{
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        upload: (key: string, body: Buffer | string) => {
            return;
        }
    }
};

export { serviceMocks };
