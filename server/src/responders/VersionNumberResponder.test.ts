import { VersionNumberResponder } from './VersionNumberResponder';

import { serviceMocks } from '../services/ServiceMocks';

import type * as express from 'express';

const mockRes = () => {
    return {
        set: jest.fn().mockReturnThis(),
        json: jest.fn().mockReturnThis()
    };
};

describe('getVersion', () => {
    describe('local', () => {
        const res = mockRes();

        VersionNumberResponder.getVersion(
            serviceMocks,
            null,
            (<unknown>res) as express.Response
        );

        test('header', () => {
            expect(res.set.mock.calls[0][0]).toBe('Content-Type');
            expect(res.set.mock.calls[0][1]).toBe('application/json');
        });

        test('body', () => {
            expect(res.json.mock.calls[0][0]).toStrictEqual('jest');
        });
    });
});
