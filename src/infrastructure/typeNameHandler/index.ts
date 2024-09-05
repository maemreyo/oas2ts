// src/infrastructure/typeNameHandler/index.ts
export function generateTypeName(schemaName: string): string {
  return toPascalCase(schemaName);
}

export function toPascalCase(name: string): string {
  return name.replace(/(^\w|-\w)/g, (match) =>
    match.replace('-', '').toUpperCase(),
  ); // PascalCase
}

export function sanitizeTypeName(typeName: string): string {
  return typeName.replace(/[^a-zA-Z0-9]/g, ''); // Xóa ký tự không hợp lệ
}
