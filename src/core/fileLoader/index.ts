import * as fs from 'fs';
import * as path from 'path';
import logger from '../../shared/logger';

// Load files from a directory with error handling
export const loadFiles = (directory: string): string[] => {
  try {
    const files = fs
      .readdirSync(directory)
      .map((file) => path.join(directory, file));
    logger.info('Files loaded successfully from', directory);
    return files;
  } catch (error) {
    logger.error('Error loading files from directory', directory, error);
    throw new Error(`Failed to load files from ${directory}`);
  }
};
