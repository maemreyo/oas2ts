import * as fs from 'fs';
import * as path from 'path';
import { loadFiles } from '../core/fileLoader';
import { generateTypeFiles } from '../core/typeGenerator';
import logger from '../shared/logger';

/**
 * Loads JSON configuration from the root directory.
 *
 * @param configPath - The path to the configuration file (JSON or YAML).
 * @returns Parsed configuration object.
 * @throws Will throw an error if the config file cannot be loaded.
 */
const loadJsonConfig = (configPath?: string): any => {
  try {
    // Ensure the config file is being read from the root directory if no path is provided
    const resolvedConfigPath = configPath
      ? path.resolve(process.cwd(), configPath)
      : path.resolve(process.cwd(), 'oas2ts.config.json');

    const configFile = fs.readFileSync(resolvedConfigPath, 'utf8');
    return JSON.parse(configFile);
  } catch (error) {
    logger.error('Error loading config file', error);
    throw new Error('Failed to load configuration');
  }
};

/**
 * CLI entry point
 */
export const runCLI = () => {
  try {
    // Load configuration from JSON in root directory or specified path
    const config = loadJsonConfig();

    // Load schema files from the specified directory in config
    const schemas = loadFiles(config.schemaDirectory);

    // Generate types for the loaded schema files and output to the directory in config
    generateTypeFiles(schemas, './oas2ts.config.json');

    logger.info('CLI executed successfully');
  } catch (error) {
    logger.error('Error executing CLI', error);
  }
};
