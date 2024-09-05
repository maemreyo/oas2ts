"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCachedFile = exports.cacheFile = void 0;
// src/shared/cache/index.ts
const cache = {};
function cacheFile(filePath, content) {
    cache[filePath] = content;
}
exports.cacheFile = cacheFile;
function getCachedFile(filePath) {
    return cache[filePath] || null;
}
exports.getCachedFile = getCachedFile;
