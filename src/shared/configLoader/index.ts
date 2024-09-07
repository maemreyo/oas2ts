import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

/**
 * Interface defining the structure of the configuration file.
 */
export interface Config {
  schemaDirectory: string;
  outputDirectory: string;
  baseType: Record<string, { type: string; format?: string; props?: string[] }>;
}

/**
 * Loads a configuration file in either JSON or YAML format.
 *
 * @param configPath - The path to the configuration file.
 * @returns The parsed configuration object.
 * @throws Will throw an error if the file format is not supported.
 */
export const loadConfig = (configPath: string): Config => {
  const ext = path.extname(configPath);

  // Check the format of the configuration file (only supports .json or .yaml)
  if (!['.json', '.yaml', '.yml'].includes(ext)) {
    throw new Error('Unsupported config file format. Use .json or .yaml.');
  }

  // Read the contents of the configuration file
  const configFile = fs.readFileSync(configPath, 'utf8');

  // Parse the file based on its extension (JSON or YAML)
  let config: Config;
  if (ext === '.json') {
    config = JSON.parse(configFile);
  } else {
    config = yaml.load(configFile) as Config;
  }

  return config;
};

/**
 * Returns the default configuration if no configuration file is provided.
 *
 * @returns The default configuration object.
 */
export const getDefaultConfig = (): Config => ({
  schemaDirectory: './mocks/input/schemas',
  outputDirectory: './mocks/output/types',
  baseType: {
    UUID: {
      type: 'string',
      format: 'uuid',
      props: ['id'],
    },
    ISODate: {
      type: 'string',
      format: 'date-time',
      props: ['at', 'created', 'updated', 'time'],
    },
  },
});
