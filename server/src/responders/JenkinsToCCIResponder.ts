import * as axios from 'axios';
import * as fs from 'fs';
import * as util from 'util';
import * as uuid from 'uuid';

import * as jfcModule from '../../assets/jfc-module.js';

import type * as express from 'express';

import type { ExpressWrapper } from '../ExpressWrapper';
import type { AmplitudeClientService } from '../services/AmplitudeClientService.js';

declare const __JENKINS_TARGET: string;

/* istanbul ignore next */
require.extensions &&
    (require.extensions['.html'] = (module: NodeJS.Module, filename: string) =>
        (module.exports = fs.readFileSync(filename)));
const cliHTML = require('../../assets/cli.html');

class JenkinsToCCIResponder {
    public static webUI(
        services: ExpressWrapper['services'],
        req: express.Request,
        res: express.Response
    ): void {
        services.AmplitudeClient.logEvent({
            event_type: 'GET /i'
        });

        // TODO: Redirect to Developer Hub?

        res.status(200)
            .set('Content-Type', 'text/html; charset=UTF-8')
            .end(cliHTML);
    }

    public static convertJenkinsfileToConfigYml(
        services: ExpressWrapper['services'],
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        const rid = uuid.v4();

        res.set('X-RID', rid);

        // TODO: Upload incoming Jenkinsfile to S3

        return jfcModule
            .jenkinsToCCI(req.body, rid)
            .then((ret) => {
                services.AmplitudeClient.logEvent({
                    event_type: '200: POST /i',
                    event_properties: {
                        rid
                    }
                });

                // TODO: Upload the outgoing config.yml to S3

                res.status(200).set('Content-Type', 'text/x-yaml').end(ret); // TODO: Change to return JSON instead
            })
            .catch((error) => {
                JenkinsToCCIResponder.returnErrorMessage(
                    rid,
                    req,
                    res,
                    error,
                    services.VersionNumber.versionNumber,
                    services.AmplitudeClient
                );
            });
    }

    public static convertJenkinsfileToJSON(
        services: ExpressWrapper['services'],
        req: express.Request,
        res: express.Response
    ): Promise<void> {
        const rid = uuid.v4();

        return axios.default
            .post(
                typeof __JENKINS_TARGET === typeof '' && __JENKINS_TARGET !== ''
                    ? __JENKINS_TARGET
                    : 'https://jenkinsto.cc/i/to-json',
                req.body.toString('utf-8'),
                {
                    transformResponse: (res) => res
                }
            )
            .then((ret) => {
                services.AmplitudeClient.logEvent({
                    event_type: '200: POST /i/to-json'
                });

                res.status(200)
                    .set('Content-Type', 'application/json')
                    .end(ret.data);
            })
            .catch((error) => {
                JenkinsToCCIResponder.returnErrorMessage(
                    rid,
                    req,
                    res,
                    error,
                    services.VersionNumber.versionNumber,
                    services.AmplitudeClient
                );
            });
    }

    private static returnErrorMessage(
        rid: string,
        req: express.Request,
        res: express.Response,
        err: any,
        serverVersion: string,
        ampCli: AmplitudeClientService
    ): void {
        const bodyObj: { [key: string]: any } = {};
        const httpStatus: number = JenkinsToCCIResponder.httpErrorStatus(err);

        try {
            bodyObj.greeting =
                'Conversion failed. Please contact support with this entire error message.';
            bodyObj.at = new Date().toUTCString();
            bodyObj.serverVersion = serverVersion;
            bodyObj.calling = `${req.method} ${req.path}`;
            bodyObj.errorName = err && err.name ? err.name : '';
            bodyObj.message = err && err.message ? err.message : '';
            bodyObj.errorFormatted = util.format(err); // TODO: Send error details in a machine-readable format

            if (err.parserErrors) {
                bodyObj.parserErrors = err.parserErrors;
            }

            ampCli.logEvent({
                event_type: `${httpStatus}: ${bodyObj.calling}`,
                event_properties: {
                    rid,
                    errorName: err.name
                    // TODO: Consider submiting more anonymous information
                }
            });
        } catch (secondError) {
            ampCli.logEvent({
                event_type: 'Someone raised an irregular error',
                event_properties: {
                    rid,
                    errorFormatted: util.format(secondError)
                }
            });
        } finally {
            res.status(httpStatus)
                .set('Content-Type', 'application/json')
                .end(JSON.stringify(bodyObj, null, 4));
        }
    }

    private static httpErrorStatus(err: any): number {
        try {
            switch (true) {
                case err.errorIn === 'client':
                    return 400;
                case err.errorIn === 'server':
                default:
                    return 500;
            }
        } catch (err) {
            return 500;
        }
    }
}

export { JenkinsToCCIResponder };
