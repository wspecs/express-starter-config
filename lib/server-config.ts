import * as args from 'args-finder';
import { readFileSync } from 'fs';

const DEFAULT_PORT = 1234;
const DEFAULT_INSTANCE = 'dev';

let config = {
  instance: args.options.port || DEFAULT_INSTANCE,
  port: args.options.port || DEFAULT_PORT,
  base: '',
  sessionAge: 60,
  secret: 'secret',
  cookiePath: '/',
  useCookie: true,
  httpOnly: true,
  templatePath: args.options.templatePath || 'templates',
  publicPath: args.options.publicPath || 'public',
  maxAge: args.options.maxAge || 31557600000,
  controlOrigin: '*',
  allowMethods: args.options.allowedMethods || ['GET', 'POST', 'OPTIONS'],
  encryptionAlgorithm: args.options.algorithm || 'aes-256-cbc',
  encryptionBlocksize: args.options.blocksize || 16,
  encryptionKey:
    args.options.encryption_key || '8D6JCEG7VFOHX4GXXRV7H5C4TR5TSECS'
};

if (args.options.config) {
  config = {
    ...config,
    ...JSON.parse(readFileSync(String(args.options.config), 'utf8'))
  };
}

export const serverConfig = { ...config, ...args.options };
