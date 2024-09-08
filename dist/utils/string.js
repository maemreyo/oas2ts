"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPascalCase = exports.capitalize = exports.toCamelCaseFileName = exports.toPascalCaseAndRemoveDashes = exports.clearAndUpper = exports.toCamelCaseParam = exports.toCamelCase = exports.indentString = void 0;
// Indent a string by a specified level (number of spaces)
const indentString = (str, indentLevel) => {
    const indent = ' '.repeat(indentLevel);
    return indent + str;
};
exports.indentString = indentString;
// Convert a string to camelCase
const toCamelCase = (str) => {
    return str.replace(/([-_][a-z])/g, (group) => group.toUpperCase().replace('-', '').replace('_', ''));
};
exports.toCamelCase = toCamelCase;
/**
 * Helper function to convert parameters to camelCase.
 *
 * @param param - The parameter to convert.
 * @returns The converted camelCase parameter.
 */
const toCamelCaseParam = (param) => {
    return param
        .replace(/[-_](.)/g, (_, group1) => group1.toUpperCase()) // Convert snake_case or kebab-case to camelCase
        .replace(/^./, (match) => match.toLowerCase()); // Ensure the first character is lowercase
};
exports.toCamelCaseParam = toCamelCaseParam;
const clearAndUpper = (text) => {
    return text.replace(/-/, '').toUpperCase();
};
exports.clearAndUpper = clearAndUpper;
/**
 * Helper function to convert a string to PascalCase and remove dashes.
 *
 * @param str - The string to convert.
 * @returns The converted PascalCase string.
 */
const toPascalCaseAndRemoveDashes = (str) => {
    return str
        .replace(/-./g, (match) => match.charAt(1).toUpperCase()) // Remove dashes and capitalize the next letter
        .replace(/(^\w)/, (match) => match.toUpperCase()); // Capitalize the first letter
};
exports.toPascalCaseAndRemoveDashes = toPascalCaseAndRemoveDashes;
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
const toCamelCaseFileName = (filePath) => {
    // Extract the file name with the extension, discarding anything after the `#` if present
    const fileNameWithExtension = filePath.split('/').pop()?.split('#')[0] || '';
    // Remove the .yaml extension from the file name
    const fileName = fileNameWithExtension.replace('.yaml', '');
    // Convert the file name to camelCase by splitting on dashes and capitalizing subsequent words
    return fileName
        .split('-')
        .map((word, index) => (index === 0 ? word : (0, exports.capitalize)(word)))
        .join('');
};
exports.toCamelCaseFileName = toCamelCaseFileName;
/**
 * Capitalizes the first letter of a given word.
 *
 * @param word - The word to capitalize.
 * @returns The word with the first letter capitalized.
 */
const capitalize = (word) => word.charAt(0).toUpperCase() + word.slice(1);
exports.capitalize = capitalize;
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
const toPascalCase = (str) => {
    return str
        .split(/[_-]/) // Split the string by underscores or dashes
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize first letter of each word
        .join(''); // Join words without spaces
};
exports.toPascalCase = toPascalCase;
