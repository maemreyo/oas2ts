"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPascalCase = exports.toCamelCase = exports.indentString = exports.capitalize = void 0;
// Capitalize the first letter of a string
const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
};
exports.capitalize = capitalize;
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
const toPascalCase = (str) => {
    return str
        .split('_') // Split the string by underscores
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
        .join(''); // Join them back together without spaces or underscores
};
exports.toPascalCase = toPascalCase;
