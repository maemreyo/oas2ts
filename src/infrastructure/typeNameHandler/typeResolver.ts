import * as path from 'path';
import config from '../../oas2ts.config';
import { SchemaProperty, ArrayProperty } from './types';
import { toCamelCase, capitalize } from '../../utils/string';
import { isReferenceProperty, isSchemaFormat } from '../../utils/typeGuard';
import {
  DEFAULT_TYPE,
  BASE_PATH,
  BASE_IMPORT_PATH,
} from '../../utils/constants';
import { generateImportStatement } from '../../utils/importHelpers';
import { generateArrayType } from '../../utils/typeHelpers';
import { SchemaFormats, SchemaTypes } from '../../utils/enums';
import logger from '../../utils/logger';

/**
 * Resolves the TypeScript type for a given schema property.
 * This function handles `$ref`, base types from config, known formats, and basic types.
 *
 * @param prop - The schema property to resolve the type for.
 * @param propName - The name of the property being processed (used to check against config base types).
 * @param imports - A set used to collect import statements for referenced types.
 * @returns The resolved TypeScript type as a string.
 */
export const resolveType = (
  prop: SchemaProperty,
  propName: string,
  imports: Set<string>,
): string => {
  try {
    logger.info(`Resolving type for property: ${propName}`);
    // Handle $ref (external references)
    if ('$ref' in prop) {
      return resolveRefType(prop, imports);
    }

    // Handle baseType from config (UUID, ISODate, etc.)
    const baseType = resolveBaseType(prop, propName, imports);
    if (baseType) return baseType;

    // Handle known number formats (float, double)
    if (prop.type === SchemaTypes.NUMBER) {
      return resolveNumberFormat(prop);
    }

    // Handle basic types (string, integer, boolean, array)
    return resolveBasicTypes(prop, propName, imports);
  } catch (error) {
    console.error(`Error resolving type for property ${propName}`, error);
    throw error;
  }
};

/**
 * Resolves the type for `$ref` (references to other schemas).
 *
 * @param prop - The schema property containing the `$ref`.
 * @param imports - A set used to collect import statements for referenced types.
 * @returns The resolved TypeScript type from `$ref` or DEFAULT_TYPE if not found.
 */
export const resolveRefType = (
  prop: SchemaProperty,
  imports: Set<string>,
): string => {
  if (isReferenceProperty(prop)) {
    const refParts = prop.$ref.split('#');
    const filePath = refParts[0]; // Path to the file with the definition
    const refType = refParts[1] ? refParts[1].replace('/', '') : '';

    if (filePath) {
      const importFileName = toCamelCase(
        path.basename(filePath, path.extname(filePath)),
      );
      const typeName = refType || capitalize(importFileName);
      const importPath = `./${importFileName}`;

      // Add the import statement to avoid duplicates
      imports.add(`import { ${typeName} } from '${importPath}';`);
      return typeName;
    }

    return refType || DEFAULT_TYPE;
  }

  return DEFAULT_TYPE;
};

/**
 * Resolves base types from the config (e.g., UUID, ISODate).
 *
 * @param prop - The schema property to resolve the base type for.
 * @param propName - The name of the property being processed.
 * @param imports - A set used to collect import statements for referenced types.
 * @returns The resolved base type or undefined if no match is found.
 */
const resolveBaseType = (
  prop: SchemaProperty,
  propName: string,
  imports: Set<string>,
): string | undefined => {
  for (const [baseType, condition] of Object.entries(config.baseType)) {
    if (
      prop.type === condition.type && // Ensure prop.type exists and matches
      prop.format === condition.format && // Ensure prop.format exists and matches
      condition.props.some(
        (p) => propName.toLowerCase().includes(p.toLowerCase()), // Match propName against props in config
      )
    ) {
      imports.add(generateImportStatement(baseType, BASE_IMPORT_PATH));
      return baseType;
    }
  }
  return undefined;
};

/**
 * Resolves known number formats (e.g., float, double).
 *
 * @param prop - The schema property to resolve the number format for.
 * @returns The TypeScript type for the number format (e.g., 'number').
 */
const resolveNumberFormat = (prop: SchemaProperty): string => {
  if (
    isSchemaFormat(prop.format ?? '') &&
    [SchemaFormats.FLOAT, SchemaFormats.DOUBLE].includes(
      prop.format as SchemaFormats,
    )
  ) {
    return SchemaTypes.NUMBER;
  }

  return SchemaTypes.NUMBER;
};

/**
 * Resolves basic types (string, integer, boolean, array).
 *
 * @param prop - The schema property to resolve the type for.
 * @param propName - The name of the property being processed (used for arrays).
 * @param imports - A set used to collect import statements for referenced types.
 * @returns The TypeScript type for the basic type (e.g., string, number).
 */
const resolveBasicTypes = (
  prop: SchemaProperty,
  propName: string,
  imports: Set<string>,
): string => {
  switch (prop.type) {
    case SchemaTypes.STRING:
      return SchemaTypes.STRING;
    case SchemaTypes.INTEGER:
      return SchemaTypes.NUMBER;
    case SchemaTypes.BOOLEAN:
      return SchemaTypes.BOOLEAN;
    case SchemaTypes.ARRAY:
      const itemType = resolveType(
        (prop as ArrayProperty).items,
        propName,
        imports,
      );
      return generateArrayType(itemType);
    default:
      return DEFAULT_TYPE;
  }
};
