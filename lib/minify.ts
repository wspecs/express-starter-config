const walk = require('walkdir');
const shell = require('shelljs');
import * as log from 'great-logs';
import * as args from 'args-finder';

const emitter = walk(args.options.minify_path || 'public');

emitter.on('file', (filename: string, stat: any) => {
  if (
    args.options.css &&
    filename.endsWith('.css') &&
    !filename.endsWith('.min.css')
  ) {
    const newName = filename.replace(new RegExp('.css$'), '.min.css');
    log.debug('Minifying %s', filename);
    shell.exec(`uglifycss --ugly-comments ${filename} --output ${newName}`);
  }

  if (
    args.options.js &&
    filename.endsWith('.js') &&
    !filename.endsWith('.min.js')
  ) {
    const newName = filename.replace(new RegExp('.js$'), '.min.js');
    log.debug('Minifying %s', filename);
    shell.exec(`uglifyjs --compress --mangle -- ${filename} > ${newName}`);
  }
});
