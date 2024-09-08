import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import logger from '../../utils/logger';

/**
 * Parses an API model file (YAML or JSON).
 *
 * @param filePath - The path to the API model file.
 * @returns Parsed content of the file as an object.
 */
export const parseApiFile = (filePath: string): any => {
  try {
    const ext = path.extname(filePath).toLowerCase();
    const fileContent = fs.readFileSync(filePath, 'utf8');

    if (ext === '.yaml' || ext === '.yml') {
      return yaml.load(fileContent);
    } else if (ext === '.json') {
      return JSON.parse(fileContent);
    } else {
      throw new Error(`Unsupported file format: ${ext}`);
    }
  } catch (error) {
    logger.error(`Error reading API model file: ${filePath}`, error);
    return null;
  }
};
