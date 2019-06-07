import { AppConfiguratorOptions } from './rest-config';
import * as express from 'express';
/**
 * The server.
 * @class Server
 */
export declare class BaseApplicationServer {
    app: express.Application;
    private port;
    /**
     * Constructor.
     * @class Server
     * @constructor
     */
    constructor(options?: AppConfiguratorOptions);
    addControllers(...args: any[]): void;
    start(): void;
}
