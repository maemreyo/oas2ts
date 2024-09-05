// Capitalize the first letter of a string
export const capitalize = (name: string): string => {
  return name.charAt(0).toUpperCase() + name.slice(1);
};
