"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateParameterType = void 0;
const typeMapper_1 = require("./typeMapper");
/**
 * Generates a TypeScript type for a parameter.
 *
 * @param param - The parameter object with its properties.
 * @param paramName - The PascalCase name for the parameter.
 * @returns A string representing the TypeScript type definition.
 */
const generateParameterType = (param, paramName) => {
    const { schema, description } = param;
    const paramType = (0, typeMapper_1.mapToTypeScriptType)(schema?.type || 'string', schema?.format); // Use mapped TypeScript type
    const format = schema?.format ? ` (${schema.format})` : ''; // Add format if available
    // Add description as a comment
    let typeDefinition = '';
    if (description) {
        typeDefinition += `/**\n * ${description}\n */\n`;
    }
    // Generate TypeScript type definition
    typeDefinition += `export type ${paramName} = ${paramType};\n`;
    return typeDefinition;
};
exports.generateParameterType = generateParameterType;
