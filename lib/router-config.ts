import { serverConfig } from './server-config';
import { readFileSync, writeFileSync } from 'fs';
import { minify } from 'html-minifier';
import * as mkdirp from 'mkdirp';
import { AppRequest, AppResponse, Map } from './types';
const ejs = require('ejs');

export const minificationOptions = {
  collapseBooleanAttributes: true,
  collapseInlineTagWhitespace: true,
  collapseWhitespace: true,
  conservativeCollapse: true,
  decodeEntities: true,
  html5: true,
  minifyCSS: true,
  minifyJS: true,
  minifyURLs: true,
  removeComments: true,
  removeAttributeQuotes: true,
  removeEmptyAttributes: true,
  removeOptionalTags: true
};

export function resolveRequest(err: Error, res: AppResponse, body = {}) {
  if (err) {
    res.statusCode = 500;
    res.send({ success: false });
  } else {
    res.send({ ...body, success: true });
  }
}

export function minifyResponse(
  res: AppResponse,
  name: string,
  data: Map,
  cachePath?: string
) {
  const content = readFileSync('templates/' + name + '.ejs', 'utf8');
  let html = ejs.render(content, data, {
    filename: __dirname + '/../../templates/' + name
  });
  if (data.instance === 'prod') {
    html = minify(html, minificationOptions);
  }
  if (cachePath) {
    mkdirp(cachePath.substr(0, cachePath.lastIndexOf('/')), err => {
      writeFileSync(cachePath, html, 'utf8');
      res.send(html);
    });
  } else {
    res.send(html);
  }
}

export function serve(req: AppRequest, res: AppResponse) {
  res.serve = (name: string, options = {}) => {
    const config = req.serverConfig || serverConfig;
    const data = { ...config, ...options };
    minifyResponse(res, name, data);
  };
}

export function resolve(req: AppRequest, res: AppResponse) {
  res.resolve = (error: Error, value: any) => {
    resolveRequest(error, res, value);
  };
}
