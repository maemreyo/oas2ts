import {
  SchemaFormats,
  SchemaProperty,
  ReferenceProperty,
} from '../infrastructure/typeNameHandler/types';

/**
 * Type guard to check if a given schema property is a reference property (has a $ref).
 *
 * @param prop - The schema property to check.
 * @returns True if the property has a $ref (is a ReferenceProperty), false otherwise.
 */
export const isReferenceProperty = (
  prop: SchemaProperty,
): prop is ReferenceProperty => {
  return '$ref' in prop;
};

/**
 * Type guard to check if a given string is a valid SchemaFormats value.
 *
 * @param format - The string to check.
 * @returns True if the string is a valid SchemaFormats value, false otherwise.
 */
export const isSchemaFormat = (format: string): format is SchemaFormats => {
  return Object.values(SchemaFormats).includes(format as SchemaFormats);
};
