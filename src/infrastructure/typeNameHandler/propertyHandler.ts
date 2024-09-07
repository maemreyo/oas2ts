import { SchemaProperty, ObjectProperty } from './types';
import { resolveType } from './typeResolver';
import { toCamelCase, indentString } from '../../utils/string';

export const generateProperties = (
  properties: Record<string, SchemaProperty>,
  required: string[],
  indentLevel: number,
  imports: Set<string>,
): string => {
  try {
    console.log(
      `Generating properties for object with ${Object.keys(properties).length} properties`,
    );
    return Object.keys(properties)
      .map((propName) => {
        const prop = properties[propName];
        const isRequired = required.includes(propName);
        const camelCasePropName = toCamelCase(propName);
        const type = resolveType(prop, propName, imports);
        return `${' '.repeat(indentLevel)}${camelCasePropName}${isRequired ? '' : '?'}: ${type};`;
      })
      .join('\n');
  } catch (error) {
    console.error('Error generating properties', error);
    throw error;
  }
};
