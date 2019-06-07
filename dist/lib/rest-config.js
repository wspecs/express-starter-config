"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const router_config_1 = require("./router-config");
const server_config_1 = require("./server-config");
const i18n = require("i18n");
const exp = require("express");
const locale_1 = require("./locale");
const sessions = require('client-sessions');
function configureApp(options, locales = locale_1.getAllLocales()) {
    const app = exp();
    configureRest(app, exp, locales, options);
    return app;
}
exports.configureApp = configureApp;
function configureRest(app, express, locales = locale_1.getAllLocales(), { publicPathHandler = null }) {
    // session limit in seconds
    if (server_config_1.serverConfig.sessionAge) {
        app.set('sessionAge', app.get('sessionAge') || server_config_1.serverConfig.sessionAge || 2 * 60 * 60);
    }
    if (server_config_1.serverConfig.secret) {
        app.set('secret', app.get('secret') || server_config_1.serverConfig.secret);
    }
    if (server_config_1.serverConfig.useCookie) {
        app.set('cookiePath', server_config_1.serverConfig.cookiePath || app.get('cookiePath') || '/');
        app.set('httpOnly', server_config_1.serverConfig.cookiePath || app.get('httpOnly'));
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
    app.set('publicPath', server_config_1.serverConfig.publicPath || app.get('publicPath'));
    app.set('maxAge', server_config_1.serverConfig.maxAge || app.get('maxAge'));
    if (!app.get('publicPath')) {
        throw new Error('public path is missing');
    }
    if (publicPathHandler) {
        app.use(publicPathHandler);
    }
    app.use(express.static(app.get('publicPath'), { maxAge: app.get('maxAge') }));
    /**
     * Define default headers for the application.
     */
    app.use((req, res, next) => {
        res.setHeader('Access-Control-Allow-Origin', server_config_1.serverConfig.controlOrigin);
        res.setHeader('Access-Control-Allow-Methods', server_config_1.serverConfig.allowMethods.join(', '));
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type,accept,access_token,X-Requested-With');
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
    app.set('templatePath', server_config_1.serverConfig.templatePath || app.get('templatePath'));
    if (!app.get('templatePath')) {
        throw new Error('template path is missing');
    }
    app.set('view engine', server_config_1.serverConfig.viewEngine);
    app.set('views', app.get('templatePath'));
    /**
     * Helper function to use with res.
     */
    app.use((req, res, next) => {
        router_config_1.resolve(req, res);
        router_config_1.serve(req, res);
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
    app.use(sessions({
        cookieName: 'adminSession',
        path: '/admin',
        secret: app.get('secret'),
        duration: 24 * 60 * 60 * 1000,
        activeDuration: 1000 * 60 * 20 // if expiresIn < activeDuration, the session will be extended by activeDuration milliseconds
    }));
}
exports.configureRest = configureRest;
