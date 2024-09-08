import * as fs from 'fs';
import * as path from 'path';
import logger from '../utils/logger';
import { loadFiles } from '../core/fileLoader';
import { generateTypeFiles } from '../core/typeGenerator';
import { parseApiModels } from '../core/apiParser';
import { parseParameterFiles } from '../core/parameterParser';

/**
 * Loads JSON configuration from the root directory.
 *
 * @param configPath - The path to the configuration file (JSON or YAML).
 * @returns Parsed configuration object.
 * @throws Will throw an error if the config file cannot be loaded.
 */
const loadJsonConfig = (configPath?: string): any => {
  try {
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
    const schemasDir = config.directories.input.schemas;
    const apiModelDir = config.directories.input.apiModels;
    const apiOutputDir = config.directories.output.apiModels;
    const typesDir = config.directories.output.types;
    const parameterInputDir = config.directories.input.parameters; // New input directory for parameters
    const parameterOutputDir = config.directories.output.parameters; // New output directory for parameters

    // Step 1: Generate types for parameters
    logger.info('Generating types for parameters...');
    parseParameterFiles(parameterInputDir, parameterOutputDir);
    logger.info('Parameter types generated successfully');

    // Step 2: Generate types for schemas
    logger.info('Generating types for schemas...');
    const schemas = loadFiles(schemasDir);
    generateTypeFiles(schemas, './oas2ts.config.json');
    logger.info('Schema types generated successfully');

    // Step 3: Load API model files and generate corresponding types
    logger.info('Loading API model files...');
    parseApiModels(apiModelDir, apiOutputDir, typesDir, parameterOutputDir);
    logger.info('API models parsed and types generated successfully');
  } catch (error) {
    logger.error('Error executing CLI', error);
  }
};
