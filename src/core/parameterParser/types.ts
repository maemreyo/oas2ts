/**
 * Type for schema field in a parameter.
 */
export interface ParameterSchema {
  type: string;
  format?: string;
}

/**
 * Type for the parameter object with properties.
 */
export interface Parameter {
  name: string;
  schema?: ParameterSchema;
  description?: string;
  required?: boolean;
  allowEmptyValue?: boolean;
}
