import { SchemaProperty, ObjectProperty } from './types';
import { resolveType } from './typeResolver';
import { toCamelCase, indentString } from '../../utils/string';

export const generateProperties = (
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
