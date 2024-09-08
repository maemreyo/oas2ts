import { Parameter } from './types';
import { mapToTypeScriptType } from './typeMapper';

/**
 * Generates a TypeScript type for a parameter.
 *
 * @param param - The parameter object with its properties.
 * @param paramName - The PascalCase name for the parameter.
 * @returns A string representing the TypeScript type definition.
 */
export const generateParameterType = (
  param: Parameter,
  paramName: string,
): string => {
  const { schema, description } = param;
  const paramType = mapToTypeScriptType(
    schema?.type || 'string',
    schema?.format,
  ); // Use mapped TypeScript type
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
