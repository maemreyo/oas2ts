import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

/**
 * Interface defining the structure of the configuration file.
 */
export interface Config {
  directories: {
    input: {
      schemas: string;
      apiModels: string;
    };
    output: {
      types: string;
      apiModels: string;
    };
  };
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
  directories: {
    input: {
      schemas: './mocks/input/schemas',
      apiModels: './mocks/input/paths',
    },
    output: {
      types: './mocks/output/types',
      apiModels: './mocks/output/apiModels',
    },
  },
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
