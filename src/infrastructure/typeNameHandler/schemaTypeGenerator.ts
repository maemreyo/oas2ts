import { generateProperties } from './propertyHandler';
import { resolveRefType, resolveType } from './typeResolver';
import { capitalize, toPascalCase } from '../../utils/string';
import { ObjectProperty, SchemaProperty, EnumProperty } from './types';
import logger from '../../utils/logger';

/**
 * Generates an interface definition in TypeScript based on a schema object.
 *
 * @param schemaName - The name of the schema (used for the interface name).
 * @param schema - The object schema containing properties and required fields.
 * @param imports - A set used to collect import statements for referenced types.
 * @param fileName - The name of the file being processed, used as a fallback for the interface name.
 * @returns The TypeScript interface definition as a string.
 *
 * @example
 * ```typescript
 * const schema = {
 *   properties: { id: { type: 'string' }, name: { type: 'string' } },
 *   required: ['id']
 * };
 * const interfaceCode = generateInterface('User', schema, new Set(), 'user');
 * // Returns:
 * // export interface User {
 * //   id: string;
 * //   name?: string;
 * // }
 * ```
 */
const generateInterface = (
  schemaName: string,
  schema: ObjectProperty,
  imports: Set<string>,
  fileName: string,
): string => {
  try {
    logger.debug(
      `Generating properties for interface: ${schemaName || fileName}`,
    );
    const properties = generateProperties(
      schema.properties,
      schema.required || [],
      2,
      imports,
    );
    const interfaceName = schemaName
      ? capitalize(schemaName)
      : capitalize(fileName);
    logger.debug(`Generated interface for ${interfaceName}:\n${properties}`);
    return `export interface ${interfaceName} {\n${properties}\n}\n`;
  } catch (error) {
    console.error(
      `Error generating interface for schema ${schemaName || fileName}`,
      error,
    );
    throw error;
  }
};

/**
 * Generates an enum definition in TypeScript based on a schema that contains enum values.
 *
 * @param schemaName - The name of the schema (used for the enum name).
 * @param schema - The enum schema containing the list of values.
 * @param fileName - The name of the file being processed, used as a fallback for the enum name.
 * @returns The TypeScript enum definition as a string.
 *
 * @example
 * ```typescript
 * const schema = { enum: ['admin', 'user', 'guest'] };
 * const enumCode = generateEnum('Role', schema, 'role');
 * // Returns:
 * // export enum Role {
 * //   Admin = 'admin',
 * //   User = 'user',
 * //   Guest = 'guest'
 * // }
 * ```
 */
const generateEnum = (
  schemaName: string,
  schema: EnumProperty,
  fileName: string,
): string => {
  const enumValues = schema.enum
    .map((val: string) => `  ${toPascalCase(val)} = '${val}'`)
    .join(',\n');

  const enumName = schemaName ? capitalize(schemaName) : capitalize(fileName);
  return `export enum ${enumName} {\n${enumValues}\n}\n`;
};

/**
 * Generates a type definition for a string with a specific format (e.g., UUID, date-time).
 *
 * @param schemaName - The name of the schema (used for the type alias name).
 * @param schema - The string schema containing the format.
 * @param imports - A set used to collect import statements for referenced types.
 * @param fileName - The name of the file being processed, used as a fallback for the type alias name.
 * @returns The TypeScript type alias definition as a string.
 *
 * @example
 * ```typescript
 * const schema = { type: 'string', format: 'uuid', description: 'Unique identifier' };
 * const typeCode = generateStringWithFormat('UserId', schema, new Set(), 'user');
 * // Returns:
 * // // Unique identifier
 * // export type UserId = string;
 * ```
 */
const generateStringWithFormat = (
  schemaName: string,
  schema: SchemaProperty,
  imports: Set<string>,
  fileName: string,
): string => {
  const typeName = schemaName ? capitalize(schemaName) : capitalize(fileName);
  let typeDefinition = '';

  if (schema.description) {
    typeDefinition += `// ${schema.description}\n`;
  }

  typeDefinition += `export type ${typeName} = ${resolveType(schema, schemaName, imports)};\n`;

  return typeDefinition;
};

/**
 * Generates TypeScript types from a schema by determining whether it is an interface, enum, or string with a specific format.
 *
 * @param schemaName - The name of the schema (used for the type name).
 * @param schema - The schema definition containing properties, type, enum, or format.
 * @param imports - A set used to collect import statements for referenced types.
 * @param fileName - The name of the file being processed, used as a fallback for the type name.
 * @returns The TypeScript type definition as a string.
 *
 * @example
 * ```typescript
 * const schema = {
 *   type: 'object',
 *   properties: { id: { type: 'string' }, name: { type: 'string' } },
 *   required: ['id']
 * };
 * const typeCode = generateTypesForSchema('User', schema, new Set(), 'user');
 * // Returns:
 * // export interface User {
 * //   id: string;
 * //   name?: string;
 * // }
 * ```
 */
export const generateTypesForSchema = (
  schemaName: string,
  schema: SchemaProperty,
  imports: Set<string>,
  fileName: string,
): string => {
  let typeDefinitions = '';

  try {
    // Handle object with properties (generate interface)
    if ((!schema.type && 'properties' in schema) || schema.type === 'object') {
      logger.debug(
        `Generating interface for object: ${schemaName || fileName}`,
      );
      typeDefinitions += generateInterface(
        schemaName,
        schema as ObjectProperty,
        imports,
        fileName,
      );
    }

    // Handle string enum
    else if (schema.type === 'string' && 'enum' in schema) {
      logger.debug(`Generating enum for schema: ${schemaName || fileName}`);
      typeDefinitions += generateEnum(
        schemaName,
        schema as EnumProperty,
        fileName,
      );
    }

    // Handle string with specific format (e.g., uuid)
    else if (schema.type === 'string' && schema.format) {
      logger.debug(
        `Generating string with format for schema: ${schemaName || fileName}`,
      );
      typeDefinitions += generateStringWithFormat(
        schemaName,
        schema,
        imports,
        fileName,
      );
    }

    // Handle $ref (external references)
    else if ('$ref' in schema) {
      logger.info(`Handling $ref for schema: ${schemaName || fileName}`);
      const refType = resolveRefType(schema, imports);
      typeDefinitions += `export type ${schemaName} = ${refType};\n`;
    }

    logger.debug(
      `Generated TypeScript definitions for ${schemaName || fileName}:\n${typeDefinitions}`,
    );
  } catch (error) {
    console.error(
      `Error generating types for schema ${schemaName || fileName}`,
      error,
    );
    throw error;
  }

  return typeDefinitions;
};
