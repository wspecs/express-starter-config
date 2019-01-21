import { readdirSync } from 'fs';

export function getAllLocales(folder = './locales') {
  const files = readdirSync(folder);
  return files
    .filter(x => x.indexOf('.json') !== -1)
    .map(x => x.replace('.json', ''));
}
