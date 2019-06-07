"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// package-dependency import * from '@decorators/di';
const rest_config_1 = require("./rest-config");
const server_config_1 = require("./server-config");
const express_1 = require("@decorators/express");
const log = require("great-logs");
/**
 * The server.
 * @class Server
 */
class BaseApplicationServer {
    /**
     * Constructor.
     * @class Server
     * @constructor
     */
    constructor(options) {
        this.port = server_config_1.serverConfig.port;
        //create expressjs application
        this.app = rest_config_1.configureApp(options);
        this.port = options.port || server_config_1.serverConfig.port;
    }
    addControllers(...args) {
        express_1.attachControllers(this.app, [...args]);
    }
    start() {
        this.app.listen(this.port, () => {
            log.info('port: %s', this.port);
        });
    }
}
exports.BaseApplicationServer = BaseApplicationServer;
