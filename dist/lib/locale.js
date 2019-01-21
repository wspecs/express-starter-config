"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
function getAllLocales(folder = './locales') {
    const files = fs_1.readdirSync(folder);
    return files
        .filter(x => x.indexOf('.json') !== -1)
        .map(x => x.replace('.json', ''));
}
exports.getAllLocales = getAllLocales;
