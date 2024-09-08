import * as fs from 'fs';
import logger from './logger';

/**
 * Ensures that a directory exists. If not, creates it recursively.
 *
 * @param dirPath - The path of the directory to check or create.
 */
export const ensureDirectoryExists = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    logger.info(`Created directory: ${dirPath}`);
  }
};
