"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const args = require("args-finder");
const fs_1 = require("fs");
const DEFAULT_PORT = process.env.WSPECS_PORT || process.env.VIRTUAL_PORT || 1234;
const DEFAULT_INSTANCE = process.env.WSPECS_INSTANCE || 'dev';
let config = {
    instance: args.options.port || DEFAULT_INSTANCE,
    port: args.options.port || DEFAULT_PORT,
    base: process.env.WSPECS_BASE || '',
    sessionAge: Number(process.env.WSPECS_SESSION_AGE || 60),
    secret: process.env.WSPECS_SECRET || 'secret',
    cookiePath: process.env.WSPECS_COOKIE_PATH || '/',
    useCookie: process.env.WSPECS_USE_COOKIE || true,
    httpOnly: process.env.WSPECS_HTTP_ONLY || true,
    templatePath: process.env.WSPECS_TEMPLATE_PATH ||
        args.options.templatePath ||
        'templates',
    publicPath: process.env.WSPECS_PUBLIC_PATH || args.options.publicPath || 'public',
    maxAge: process.env.WSPECS_MAX_AGE || args.options.maxAge || 31557600000,
    controlOrigin: process.env.WSPECS_CONTROL_ORIGIN || '*',
    allowMethods: process.env.WSPECS_ALLOW_METHODS ||
        args.options.allowedMethods || ['GET', 'POST', 'OPTIONS'],
    encryptionAlgorithm: process.env.WSPECS_ENCRYPTION_ALGORITHM ||
        args.options.algorithm ||
        'aes-256-cbc',
    encryptionBlocksize: process.env.WSPECS_ENCRYPTION_BLOCKSIZE || args.options.blocksize || 16,
    encryptionKey: process.env.WSPECS_ENCRYPTION_KEY ||
        args.options.encryption_key ||
        '8D6JCEG7VFOHX4GXXRV7H5C4TR5TSECS'
};
if (args.options.config) {
    config = Object.assign({}, config, JSON.parse(fs_1.readFileSync(String(args.options.config), 'utf8')));
}
exports.serverConfig = Object.assign({}, config, args.options);
