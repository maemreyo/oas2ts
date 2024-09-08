"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveFileName = exports.resolveResponseType = void 0;
const string_1 = require("../../utils/string");
/**
 * Resolves the response type from the $ref.
 */
const resolveResponseType = (ref) => {
    return ref.split('/').pop()?.replace('.yaml', '') || 'unknown';
};
exports.resolveResponseType = resolveResponseType;
/**
 * Resolves the filename from the $ref.
 */
const resolveFileName = (ref) => {
    return (0, string_1.toCamelCaseFileName)(ref.split('#')[0].split('/').pop() || '');
};
exports.resolveFileName = resolveFileName;
