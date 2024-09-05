import * as path from 'path';
import { capitalize, indentString, toCamelCase } from '../../utils/string';

// Define a basic type for JSON Schema properties
interface SchemaProperty {
  type?: string;
  properties?: Record<string, SchemaProperty>;
  required?: string[];
  enum?: string[];
  $ref?: string;
  items?: SchemaProperty;
  description?: string;
}

// Generate types for a given schema
export const generateTypesForSchema = (
  schemaName: string,
  schema: SchemaProperty,
  imports: Set<string>, // Accumulate imports from outside
  fileName: string, // File name to be used if no schema name is provided
): string => {
  let typeDefinitions = '';

  // If the schema is an object with properties
  if (schema.type === 'object' && schema.properties) {
    const properties = generateProperties(
      schema.properties,
      schema.required || [],
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
  if (schema.type === 'string' && schema.enum) {
    const enumValues = schema.enum
      .map((val: string) => `${' '.repeat(2)}${capitalize(val)} = '${val}'`)
      .join(',\n');

    const enumName = schemaName ? capitalize(schemaName) : capitalize(fileName);
    typeDefinitions += `export enum ${enumName} {\n${enumValues}\n}\n`;
  }

  // If the schema does not have specific properties or type
  if (!schema.type && schema.description) {
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
      const type = resolveType(prop, imports);
      return `${indentString(
        `${camelCasePropName}${isRequired ? '' : '?'}: ${type};`,
        indentLevel,
      )}`;
    })
    .join('\n');
};

// Resolve the type for a given schema property, including handling $ref
const resolveType = (prop: SchemaProperty, imports: Set<string>): string => {
  if (prop.$ref) {
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

  // Handle basic types
  switch (prop.type) {
    case 'string':
      return 'string';
    case 'integer':
      return 'number';
    case 'boolean':
      return 'boolean';
    case 'array':
      const itemType = resolveType(prop.items as SchemaProperty, imports);
      return `${itemType}[]`;
    default:
      return 'any';
  }
};
