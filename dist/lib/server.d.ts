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
    constructor(port?: any);
    addControllers(...args: any[]): void;
    start(): void;
}
