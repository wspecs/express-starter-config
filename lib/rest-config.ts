import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import { Application, Request, Response, NextFunction } from 'express';
import { resolve, serve } from './router-config';
import { AppRequest, AppResponse } from './types';
import { serverConfig } from './server-config';
import * as i18n from 'i18n';
const sessions = require('client-sessions');

export function configureRest(
  app: Application,
  express: any,
  locales: string[] = []
) {
  // session limit in seconds
  if (serverConfig.sessionAge) {
    app.set(
      'sessionAge',
      app.get('sessionAge') || serverConfig.sessionAge || 2 * 60 * 60
    );
  }
  if (serverConfig.secret) {
    app.set('secret', app.get('secret') || serverConfig.secret);
  }
  if (serverConfig.useCookie) {
    app.set(
      'cookiePath',
      serverConfig.cookiePath || app.get('cookiePath') || '/'
    );
    app.set('httpOnly', serverConfig.cookiePath || app.get('httpOnly'));
    app.locals.cookieOptions = {
      path: app.get('cookiePath'),
      maxAge: app.get('sessionAge'),
      httpOnly: app.get('httpOnly')
    };

    /**
     * Add parser to get/set cookies.
     */
    app.use(cookieParser());
  }

  /**
   * Set the public path fo the application
   */
  app.set('publicPath', serverConfig.publicPath || app.get('publicPath'));
  app.set('maxAge', serverConfig.maxAge || app.get('maxAge'));
  if (!app.get('publicPath')) {
    throw new Error('public path is missing');
  }
  app.use(express.static(app.get('publicPath'), { maxAge: app.get('maxAge') }));

  /**
   * Define default headers for the application.
   */
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', serverConfig.controlOrigin);
    res.setHeader(
      'Access-Control-Allow-Methods',
      serverConfig.allowMethods.join(', ')
    );
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type,accept,access_token,X-Requested-With'
    );
    res.setHeader('Date', new Date().toString());
    next();
  });

  /**
   * Initialize body parser for POST methods
   */
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  /**
   * Set the view path for ejs render
   */
  app.set('templatePath', serverConfig.templatePath || app.get('templatePath'));
  if (!app.get('templatePath')) {
    throw new Error('template path is missing');
  }
  app.set('view engine', 'ejs');
  app.set('views', app.get('templatePath'));

  /**
   * Helper function to use with res.
   */
  app.use((req: Request, res: Response, next: NextFunction) => {
    resolve(req as AppRequest, res as AppResponse);
    serve(req as AppRequest, res as AppResponse);
    next();
  });

  /**
   * Set Internalization.
   */
  if (locales) {
    i18n.configure({
      autoReload: true,
      locales: locales,
      defaultLocale: locales[0],
      directory: './locales',
      queryParameter: 'locale',
      cookie: 'locale'
    });
    app.use(i18n.init);
  }

  /**
   * Client session info
   */
  app.use(
    sessions({
      cookieName: 'adminSession',
      path: '/admin',
      secret: app.get('secret'),
      duration: 24 * 60 * 60 * 1000,
      activeDuration: 1000 * 60 * 20 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
    })
  );
}
