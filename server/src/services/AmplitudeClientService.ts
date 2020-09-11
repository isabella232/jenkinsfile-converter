import * as os from 'os';

import * as Amplitude from '@amplitude/node';

declare const __BUILD_VERSION: string;

class AmplitudeClientService {
    protected client = process.env.JFC_AMPLITUDE_API_KEY
        ? Amplitude.init(process.env.JFC_AMPLITUDE_API_KEY)
        : {
              logEvent: () => {}
          };

    public logEvent(event: Amplitude.Event) {
        event.device_id = event.device_id ? event.device_id : os.hostname();
        event.version_name =
            typeof __BUILD_VERSION === typeof '' ? __BUILD_VERSION : 'local';
        this.client.logEvent(event);
    }
}

export { AmplitudeClientService };
