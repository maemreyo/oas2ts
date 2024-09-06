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

export const toPascalCase = (str: string): string => {
  return str
    .split('_') // Split the string by underscores
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize the first letter of each word
    .join(''); // Join them back together without spaces or underscores
};
