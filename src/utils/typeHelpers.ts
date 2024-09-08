import * as fs from 'fs';
import * as path from 'path';

// Define the structure of the returned object
interface FileInfo {
  fileName: string;
  filePath: string;
  fileSize: number;
  lastModified: Date;
}

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

/**
 * Utility function to search for a TypeScript type in a directory and return file details.
 *
 * This function recursively searches through all files in a directory (including nested folders),
 * looking for a TypeScript type definition that matches the provided typeName. If found, it returns
 * an object containing detailed information about the file. If not found, it returns null.
 *
 * @param inputDir - The directory to search in.
 * @param typeName - The TypeScript type name to search for.
 * @returns An object with file details if the type is found, or null if not found.
 */
export const findTypeInDirectory = (
  inputDir: string,
  typeName: string,
): FileInfo | null => {
  const files = fs.readdirSync(inputDir);

  // Iterate through all files and directories in the given directory
  for (const file of files) {
    const filePath = path.join(inputDir, file);
    const fileStat = fs.statSync(filePath);

    // If it's a directory, recursively search inside it
    if (fileStat.isDirectory()) {
      const result = findTypeInDirectory(filePath, typeName);
      if (result) return result;
    }
    // If it's a file, check if it contains the type definition
    else if (fileStat.isFile() && file.endsWith('.ts')) {
      const fileContent = fs.readFileSync(filePath, 'utf-8');

      // Search for the type definition (e.g., `export type typeName = ...`)
      const typeDefinitionRegex = new RegExp(
        `export\\s+type\\s+${typeName}\\s*=`,
      );
      if (typeDefinitionRegex.test(fileContent)) {
        // Return an object containing detailed information about the file
        return {
          fileName: path.basename(filePath),
          filePath: filePath,
          fileSize: fileStat.size,
          lastModified: fileStat.mtime,
        };
      }
    }
  }

  // If the type is not found, return null
  return null;
};
