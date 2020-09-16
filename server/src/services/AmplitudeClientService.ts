import * as os from 'os';

import * as Amplitude from '@amplitude/node';

class AmplitudeClientService {
    public client = process.env.JFC_AMPLITUDE_API_KEY
        ? Amplitude.init(process.env.JFC_AMPLITUDE_API_KEY)
        : {
              logEvent: () => {}
          };

    public logEvent(event: Amplitude.Event) {
        event.device_id = event.device_id ? event.device_id : os.hostname();
        this.client.logEvent(event);
    }
}

export { AmplitudeClientService };
