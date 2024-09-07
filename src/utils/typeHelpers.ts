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
