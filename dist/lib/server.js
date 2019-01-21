"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rest_config_1 = require("./rest-config");
const server_config_1 = require("./server-config");
// package-dependency import * from '@decorators/di';
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
    constructor(port = server_config_1.serverConfig.port) {
        this.port = server_config_1.serverConfig.port;
        //create expressjs application
        this.app = rest_config_1.configureApp();
        this.port = port;
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
