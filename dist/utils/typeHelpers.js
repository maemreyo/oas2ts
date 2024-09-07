"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateArrayType = void 0;
/**
 * Generates a TypeScript array type.
 *
 * @param itemType - The type of the items in the array.
 * @returns The formatted TypeScript array type as a string.
 *
 * @example
 * generateArrayType('string');
 * // Returns: "string[]"
 */
const generateArrayType = (itemType) => {
    return `${itemType}[]`;
};
exports.generateArrayType = generateArrayType;
