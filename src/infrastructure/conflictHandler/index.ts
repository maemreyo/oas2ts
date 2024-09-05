// Handle potential name conflicts by appending a unique suffix
export const resolveConflict = (
  name: string,
  usedNames: Set<string>,
): string => {
  let newName = name;
  let counter = 1;
  while (usedNames.has(newName)) {
    newName = `${name}_${counter}`;
    counter++;
  }
  usedNames.add(newName);
  return newName;
};
