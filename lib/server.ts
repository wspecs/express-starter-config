import { configureApp } from './rest-config';
import { serverConfig } from './server-config';
// package-dependency import * from '@decorators/di';
import { attachControllers, Controller } from '@decorators/express';
import * as log from 'great-logs';
import * as express from 'express';

/**
 * The server.
 * @class Server
 */
export class BaseApplicationServer {
  app: express.Application;
  private port = serverConfig.port;

  /**
   * Constructor.
   * @class Server
   * @constructor
   */
  constructor(port = serverConfig.port) {
    //create expressjs application
    this.app = configureApp();
    this.port = port;
  }

  addControllers(...args: any[]) {
    attachControllers(this.app, [...args]);
  }

  start() {
    this.app.listen(this.port, () => {
      log.info('port: %s', this.port);
    });
  }
}
