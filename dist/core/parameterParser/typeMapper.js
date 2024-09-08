"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToTypeScriptType = void 0;
/**
 * Maps OpenAPI schema types/formats to TypeScript types.
 *
 * @param type - The OpenAPI type (e.g., 'integer', 'string').
 * @param format - The OpenAPI format (e.g., 'float', 'double').
 * @returns The corresponding TypeScript type.
 */
const mapToTypeScriptType = (type, format) => {
    if (type === 'integer' || type === 'number') {
        if (format === 'float' || format === 'double') {
            return 'number'; // Map float and double to number
        }
        return 'number'; // Map integer to number
    }
    if (type === 'boolean') {
        return 'boolean'; // Map boolean to boolean
    }
    // Default to 'string' for all other types, including 'string'
    return 'string';
};
exports.mapToTypeScriptType = mapToTypeScriptType;
