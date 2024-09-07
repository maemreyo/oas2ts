"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateObjectType = exports.generateArrayType = void 0;
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
/**
 * Generates a TypeScript object type from a list of properties.
 *
 * @param properties - An array of strings representing the properties of the object.
 * @returns A TypeScript object type as a string.
 *
 * @example
 * ```typescript
 * const properties = ['id: string', 'name: string'];
 * const objectType = generateObjectType(properties);
 * // Result: '{ id: string; name: string }'
 * ```
 */
const generateObjectType = (properties) => {
    return `{ ${properties.join('; ')} }`;
};
exports.generateObjectType = generateObjectType;
