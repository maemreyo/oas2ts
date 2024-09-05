export function parseSchema(schema: any): any {
  return schema;
}

export function handleSpecialTypes(schema: any): string {
  if (schema.enum) {
    return schema.enum.join(' | ');
  }
  if (schema.oneOf) {
    return schema.oneOf.map(handleSpecialTypes).join(' | ');
  }
  return 'any';
}
