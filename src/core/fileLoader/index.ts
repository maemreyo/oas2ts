// @ts-nocheck
import * as fs from 'fs-extra';
import logger from '../../shared/logger';
import yaml from 'js-yaml';

export async function loadYamlFile(filePath: string): Promise<any> {
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    const parsedYaml = yaml.load(fileContents);

    // Log all $ref to check for unwanted quotes
    if (parsedYaml && typeof parsedYaml === 'object') {
      Object.keys(parsedYaml).forEach((key) => {
        if (parsedYaml[key]?.$ref) {
          logger.info(`Parsed $ref: ${parsedYaml[key].$ref}`);
        }
      });
    }
    return parsedYaml;
  } catch (error) {
    logger.error('Failed to load YAML file', { filePath, error });
    throw error;
  }
}

export async function loadJsonFile(filePath: string): Promise<any> {
  try {
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
  } catch (error) {
    logger.error('Failed to load JSON file', { filePath, error });
    throw error;
  }
}
