"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setToCache = exports.getFromCache = void 0;
const cache = new Map();
// Get item from cache
const getFromCache = (key) => {
    return cache.get(key);
};
exports.getFromCache = getFromCache;
// Set item to cache
const setToCache = (key, value) => {
    cache.set(key, value);
};
exports.setToCache = setToCache;
