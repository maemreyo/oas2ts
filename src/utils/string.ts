import * as fs from 'fs';
import logger from './logger';

// Indent a string by a specified level (number of spaces)
export const indentString = (str: string, indentLevel: number): string => {
  const indent = ' '.repeat(indentLevel);
  return indent + str;
};

// Convert a string to camelCase
export const toCamelCase = (str: string): string => {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', ''),
  );
};

/**
 * Ensures that a directory exists. If not, creates it recursively.
 *
 * @param dirPath - The path of the directory to check or create.
 */
export const ensureDirectoryExists = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    logger.info(`Created directory: ${dirPath}`);
  }
};

/**
 * Helper function to convert parameters to camelCase.
 *
 * @param param - The parameter to convert.
 * @returns The converted camelCase parameter.
 */
export const toCamelCaseParam = (param: string): string => {
  return param
    .replace(/[-_](.)/g, (_, group1) => group1.toUpperCase()) // Convert snake_case or kebab-case to camelCase
    .replace(/^./, (match) => match.toLowerCase()); // Ensure the first character is lowercase
};

export const clearAndUpper = (text: string): string => {
  return text.replace(/-/, '').toUpperCase();
};

/**
 * Helper function to convert a string to PascalCase and remove dashes.
 *
 * @param str - The string to convert.
 * @returns The converted PascalCase string.
 */
export const toPascalCaseAndRemoveDashes = (str: string): string => {
  return str
    .replace(/-./g, (match) => match.charAt(1).toUpperCase()) // Remove dashes and capitalize the next letter
    .replace(/(^\w)/, (match) => match.toUpperCase()); // Capitalize the first letter
};

/**
 * Converts a YAML file path into camelCase format, removing dashes.
 *
 * This function extracts the file name from a given file path,
 * removes the `.yaml` extension, and converts the name to camelCase,
 * eliminating any dashes between words.
 *
 * @param filePath - The path to the YAML file, including its name and extension.
 * @returns The file name in camelCase format without dashes and without the `.yaml` extension.
 */
export const toCamelCaseFileName = (filePath: string): string => {
  // Extract the file name with the extension, discarding anything after the `#` if present
  const fileNameWithExtension = filePath.split('/').pop()?.split('#')[0] || '';

  // Remove the .yaml extension from the file name
  const fileName = fileNameWithExtension.replace('.yaml', '');

  // Convert the file name to camelCase by splitting on dashes and capitalizing subsequent words
  return fileName
    .split('-')
    .map((word, index) => (index === 0 ? word : capitalize(word)))
    .join('');
};

/**
 * Capitalizes the first letter of a given word.
 *
 * @param word - The word to capitalize.
 * @returns The word with the first letter capitalized.
 */
export const capitalize = (word: string): string =>
  word.charAt(0).toUpperCase() + word.slice(1);

/**
 * Converts a snake_case or kebab-case string to PascalCase.
 *
 * This function takes a string with either underscores or dashes as separators
 * and converts it to PascalCase, capitalizing the first letter of each word
 * and removing the separators.
 *
 * @param str - The snake_case or kebab-case string to convert.
 * @returns The string in PascalCase format.
 */
export const toPascalCase = (str: string): string => {
  return str
    .split(/[_-]/) // Split the string by underscores or dashes
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
    .join(''); // Join words without spaces
};
