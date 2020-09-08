import * as Amplitude from '@amplitude/node';

class AmplitudeClientService {
    public client = process.env.JFC_AMPLITUDE_API_KEY
        ? Amplitude.init(process.env.JFC_AMPLITUDE_API_KEY)
        : {
              logEvent: () => {}
          };

    public logEvent(event: Amplitude.Event) {
        this.client.logEvent(event);
    }
}

export { AmplitudeClientService };
