// Capitalize the first letter of a string
export const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Indent a string by a specified level (number of spaces)
export const indentString = (str: string, indentLevel: number): string => {
  const indent = ' '.repeat(indentLevel);
  return indent + str;
};

// Convert a string to camelCase
export const toCamelCase = (str: string): string => {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', ''),
  );
};
