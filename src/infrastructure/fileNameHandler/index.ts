import * as path from 'path';

// Handle file paths and ensure consistency
export const getFilePath = (directory: string, fileName: string): string => {
  return path.join(directory, fileName);
};
