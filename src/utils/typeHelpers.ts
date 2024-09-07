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
export const generateArrayType = (itemType: string): string => {
  return `${itemType}[]`;
};

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
export const generateObjectType = (properties: string[]): string => {
  return `{ ${properties.join('; ')} }`;
};
