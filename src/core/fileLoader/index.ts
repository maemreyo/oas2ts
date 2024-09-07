import * as fs from 'fs';
import * as path from 'path';
import logger from '../../utils/logger';

/**
 * Loads all files recursively from a directory.
 *
 * @param dirPath - The directory path to load files from.
 * @returns An array of file paths.
 */
export const loadFiles = (dirPath: string): string[] => {
  let fileList: string[] = [];

  try {
    const items = fs.readdirSync(dirPath);

    items.forEach((item) => {
      const fullPath = path.join(dirPath, item);

      // Check if the item is a directory or a file
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        // Recursively load files from the subdirectory
        fileList = fileList.concat(loadFiles(fullPath));
      } else if (stat.isFile()) {
        fileList.push(fullPath);
      }
    });
  } catch (error) {
    logger.error(`Error reading directory: ${dirPath}`, error);
  }

  return fileList;
};
