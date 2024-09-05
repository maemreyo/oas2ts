import { loadFiles } from '../core/fileLoader';
import { generateTypeFiles } from '../core/typeGenerator';
import { config } from '../config';
import logger from '../shared/logger';

// CLI entry point
export const runCLI = () => {
  try {
    const schemas = loadFiles(config.schemaDirectory);
    generateTypeFiles(schemas);
    logger.info('CLI executed successfully');
  } catch (error) {
    logger.error('Error executing CLI', error);
  }
};
