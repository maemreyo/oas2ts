import * as path from 'path';
import {
  capitalize,
  indentString,
  toCamelCase,
  toPascalCase,
} from '../../utils/string';
import config from '../../oas2ts.config';

// Base type for all schema properties
interface BaseProperty {
  description?: string;
  type?: string;
  format?: string;
}

// Type for properties with references
interface ReferenceProperty extends BaseProperty {
  $ref: string;
}

// Type for enum properties
interface EnumProperty extends BaseProperty {
  enum: string[];
}

// Type for object properties
interface ObjectProperty extends BaseProperty {
  properties: Record<string, SchemaProperty>;
  required?: string[];
}

// Type for array properties
interface ArrayProperty extends BaseProperty {
  items: SchemaProperty;
}

// General SchemaProperty type that combines all cases
type SchemaProperty =
  | BaseProperty
  | ReferenceProperty
  | EnumProperty
  | ObjectProperty
  | ArrayProperty;

// Generate types for a given schema
export const generateTypesForSchema = (
  schemaName: string,
  schema: SchemaProperty,
  imports: Set<string>, // Accumulate imports from outside
  fileName: string, // File name to be used if no schema name is provided
): string => {
  let typeDefinitions = '';

  // If the schema is an object with properties
  if ((!schema.type && 'properties' in schema) || schema.type === 'object') {
    const properties = generateProperties(
      (schema as ObjectProperty).properties,
      (schema as ObjectProperty).required || [],
      2, // Indentation level (2 spaces)
      imports, // Pass along the imports set to track $ref
    );

    // Use schema name or fallback to the file name
    const interfaceName = schemaName
      ? capitalize(schemaName)
      : capitalize(fileName);
    typeDefinitions += `export interface ${interfaceName} {\n${properties}\n}\n`;
  }

  // If the schema is an enum (a string with a list of enum values)
  else if (schema.type === 'string' && 'enum' in schema) {
    const enumValues = schema.enum
      .map((val: string) => `${' '.repeat(2)}${toPascalCase(val)} = '${val}'`) // Convert each value to PascalCase
      .join(',\n');

    const enumName = schemaName ? capitalize(schemaName) : capitalize(fileName);
    typeDefinitions += `export enum ${enumName} {\n${enumValues}\n}\n`;
  }

  // Handle other string types with specific formats like uuid
  else if (schema.type === 'string' && schema.format) {
    const typeName = schemaName ? capitalize(schemaName) : capitalize(fileName);

    // Add description if available
    if (schema.description) {
      typeDefinitions += `// ${schema.description}\n`;
    }

    typeDefinitions += `export type ${typeName} = ${resolveType(schema, schemaName, imports)};\n`;
  }

  // If the schema does not have specific properties or type
  else if (!schema.type && !('properties' in schema) && schema.description) {
    const typeName = schemaName ? capitalize(schemaName) : capitalize(fileName);
    typeDefinitions += `// ${schema.description}\nexport type ${typeName} = unknown;\n`;
  }

  return typeDefinitions;
};

// Generate properties for an interface, including indent and handling $ref
const generateProperties = (
  properties: Record<string, SchemaProperty>,
  required: string[],
  indentLevel: number,
  imports: Set<string>,
): string => {
  return Object.keys(properties)
    .map((propName) => {
      const prop = properties[propName];
      const isRequired = required.includes(propName);
      const camelCasePropName = toCamelCase(propName);
      const type = resolveType(prop, propName, imports);
      return `${indentString(
        `${camelCasePropName}${isRequired ? '' : '?'}: ${type};`,
        indentLevel,
      )}`;
    })
    .join('\n');
};

const resolveType = (
  prop: SchemaProperty,
  propName: string, // Prop name to check conditions from config
  imports: Set<string>,
): string => {
  // Check for $ref
  if ('$ref' in prop) {
    const refParts = prop.$ref.split('#');
    const filePath = refParts[0];
    const refType = refParts[1] ? refParts[1].replace('/', '') : '';

    if (filePath) {
      const importFileName = toCamelCase(
        path.basename(filePath, path.extname(filePath)),
      );
      const typeName = refType || capitalize(importFileName);
      const importPath = `./${importFileName}`;

      // Avoid duplicate imports
      imports.add(`import { ${typeName} } from '${importPath}';`);

      return typeName;
    }

    return refType || 'any';
  }

  // Handle baseType from config without case sensitivity
  for (const [baseType, condition] of Object.entries(config.baseType)) {
    if (
      prop.type === condition.type && // Check if type matches (e.g., string)
      prop.format === condition.format && // Check if format matches (e.g., uuid)
      condition.props.some((p) =>
        propName.toLowerCase().includes(p.toLowerCase()),
      ) // Check if propName matches props without case sensitivity
    ) {
      imports.add(`import { ${baseType} } from './base';`);
      return baseType; // Return the baseType (e.g., UUID)
    }
  }

  // Handle known formats
  if (prop.type === 'number') {
    switch (prop.format) {
      case 'float':
      case 'double':
        return 'number'; // Map double and float to number in TypeScript
    }
  }

  // Handle basic types
  switch (prop.type) {
    case 'string':
      return 'string';
    case 'integer':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'array':
      const itemType = resolveType(
        (prop as ArrayProperty).items,
        propName,
        imports,
      );
      return `${itemType}[]`;
    default:
      return 'any';
  }
};
