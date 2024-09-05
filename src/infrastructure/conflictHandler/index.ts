// src/infrastructure/conflictHandler/index.ts
export function detectNameConflict(
  existingNames: string[],
  newName: string,
): boolean {
  return existingNames.includes(newName);
}

export function resolveNameConflict(
  existingNames: string[],
  newName: string,
): string {
  let counter = 1;
  let resolvedName = newName;
  while (existingNames.includes(resolvedName)) {
    resolvedName = `${newName}${counter}`;
    counter++;
  }
  return resolvedName;
}
