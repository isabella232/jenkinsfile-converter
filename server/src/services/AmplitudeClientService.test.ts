import { AmplitudeClientService } from './AmplitudeClientService';

const mockAmpCli: { [key: string]: jest.Mock<any, any> } = {
    logEvent: jest.fn()
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const mockAmpInit = jest.fn((apiKey: string) => mockAmpCli);

jest.mock('@amplitude/node');

describe('AmplitudeClientService', () => {
    beforeAll(() => {
        const Amplitude = require('@amplitude/node');

        Amplitude.init.mockImplementation(mockAmpInit);
    });

    test('logEvent: w/o key', () => {
        const testEvent = {
            event_type: 'jest'
        };

        new AmplitudeClientService().logEvent(testEvent);

        expect(mockAmpInit.mock.calls.length).toEqual(0);
    });

    test('logEvent: w/ key', () => {
        const testEvent = {
            event_type: 'jest'
        };

        mockAmpInit.mockClear();
        process.env.JFC_AMPLITUDE_API_KEY = 'sample key';

        new AmplitudeClientService().logEvent(testEvent);

        expect(mockAmpInit.mock.calls[0][0]).toEqual(
            process.env.JFC_AMPLITUDE_API_KEY
        );
        expect(mockAmpCli.logEvent.mock.calls[0][0]).toStrictEqual(testEvent);
    });
});
