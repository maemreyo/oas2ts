// src/shared/namingConvention/index.ts
export function applyInterfaceNamingConvention(name: string): string {
  return toPascalCase(name);
}

export function applyPropertyNamingConvention(name: string): string {
  return toCamelCase(name);
}

export function toCamelCase(name: string): string {
  return name.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}

export function toPascalCase(name: string): string {
  return name.replace(/(^\w|-\w)/g, (match) =>
    match.replace('-', '').toUpperCase(),
  ); // PascalCase
}
