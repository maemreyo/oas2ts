import * as yaml from 'js-yaml';
import * as fs from 'fs';
import logger from '../../utils/logger';

// Parse the schema from a YAML or JSON file
export const parseSchema = (filePath: string): any => {
  try {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    const schema =
      filePath.endsWith('.yaml') || filePath.endsWith('.yml')
        ? yaml.load(fileContent)
        : JSON.parse(fileContent);
    logger.info('Schema parsed successfully', filePath);
    return schema;
  } catch (error) {
    logger.error('Error parsing schema from file', filePath, error);
    throw new Error(`Failed to parse schema from ${filePath}`);
  }
};
