export interface BaseProperty {
  description?: string;
  type?: string;
  format?: string;
}

export interface ReferenceProperty extends BaseProperty {
  $ref: string;
}

export interface EnumProperty extends BaseProperty {
  enum: string[];
}

export interface ObjectProperty extends BaseProperty {
  properties: Record<string, SchemaProperty>;
  required?: string[];
}

export interface ArrayProperty extends BaseProperty {
  items: SchemaProperty;
}

export type SchemaProperty =
  | BaseProperty
  | ReferenceProperty
  | EnumProperty
  | ObjectProperty
  | ArrayProperty;

// Define a TypeScript enum for schema types
export enum SchemaTypes {
  STRING = 'string',
  NUMBER = 'number',
  BOOLEAN = 'boolean',
  ARRAY = 'array',
  OBJECT = 'object',
  INTEGER = 'integer',
}

// Define an enum for common formats
export enum SchemaFormats {
  FLOAT = 'float',
  DOUBLE = 'double',
  UUID = 'uuid',
  DATE_TIME = 'date-time',
}
