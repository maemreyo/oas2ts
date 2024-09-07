/**
 * Generates an import statement in TypeScript format.
 *
 * @param typeName - The name of the type being imported.
 * @param importPath - The path to the file where the type is located.
 * @returns The formatted import statement as a string.
 *
 * @example
 * generateImportStatement('User', './user');
 * // Returns: "import { User } from './user';"
 */
export const generateImportStatement = (
  typeName: string,
  importPath: string,
): string => {
  return `import { ${typeName} } from '${importPath}';`;
};
