import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import { loadFiles } from '../fileLoader';
import logger from '../../utils/logger';
import { toPascalCase } from '../../utils/string';

/**
 * Type for schema field in a parameter.
 */
interface ParameterSchema {
  type: string;
  format?: string;
}

/**
 * Type for the parameter object with properties.
 */
interface Parameter {
  name: string;
  schema?: ParameterSchema;
  description?: string;
  required?: boolean;
  allowEmptyValue?: boolean;
}

/**
 * Maps OpenAPI schema types/formats to TypeScript types.
 *
 * @param type - The OpenAPI type (e.g., 'integer', 'string').
 * @param format - The OpenAPI format (e.g., 'float', 'double').
 * @returns The corresponding TypeScript type.
 */
const mapToTypeScriptType = (type: string, format?: string): string => {
  if (type === 'integer' || type === 'number') {
    if (format === 'float' || format === 'double') {
      return 'number'; // Map float and double to number
    }
    return 'number'; // Map integer to number
  }

  if (type === 'boolean') {
    return 'boolean'; // Map boolean to boolean
  }

  // Default to 'string' for all other types, including 'string'
  return 'string';
};

/**
 * Generates a TypeScript type for a parameter.
 *
 * @param param - The parameter object with its properties.
 * @param paramName - The PascalCase name for the parameter.
 * @returns A string representing the TypeScript type definition.
 */
const generateParameterType = (param: any, paramName: string): string => {
  const { schema, description } = param;
  const paramType = mapToTypeScriptType(
    schema?.type || 'string',
    schema?.format,
  ); // Use mapped TypeScript type
  const format = schema?.format ? ` (${schema.format})` : ''; // Add format if available

  // Add description as a comment
  let typeDefinition = '';
  if (description) {
    typeDefinition += `/**\n * ${description}\n */\n`;
  }

  // Generate TypeScript type definition
  typeDefinition += `export type ${paramName} = ${paramType};\n`;

  return typeDefinition;
};

/**
 * Parses parameter files and generates TypeScript types for them.
 * Handles both multiple properties and single parameter definitions.
 *
 * @param inputDir - The directory containing parameter YAML files.
 * @param outputDir - The directory to output the generated TypeScript types.
 */
export const parseParameterFiles = (inputDir: string, outputDir: string) => {
  try {
    // Load all parameter files in the input directory
    const parameterFiles = loadFiles(inputDir);

    // Iterate over each parameter file
    parameterFiles.forEach((parameterFilePath) => {
      logger.info({ parameterFilePath });
      const fileContent = fs.readFileSync(parameterFilePath, 'utf8');
      const parameters = yaml.load(fileContent) as any;

      // Get the PascalCase name of the YAML file (without the extension)
      const fileName = path.basename(
        parameterFilePath,
        path.extname(parameterFilePath),
      );
      logger.info({ fileName });
      const outputFileName = `${toPascalCase(fileName)}.ts`;
      logger.info({ outputFileName });
      const outputFilePath = path.join(outputDir, outputFileName);

      // Determine if it's a single property or multiple properties
      if (parameters?.name) {
        // Single parameter case
        const param = parameters as Parameter; // Explicitly cast to Parameter type
        const paramName = toPascalCase(param.name);
        const typeDefinition = generateParameterType(param, paramName);

        // Ensure the output directory exists
        fs.mkdirSync(outputDir, { recursive: true });

        // Write the generated type to the file
        fs.writeFileSync(outputFilePath, typeDefinition, 'utf8');
        logger.info(`Generated parameter type for ${paramName}`);
      } else {
        // Multiple properties case
        let fileContentTs = '';

        // Iterate over each property and generate type
        Object.entries(parameters).forEach(([paramKey, paramValue]) => {
          const param = paramValue as Parameter; // Explicitly cast to Parameter type
          const paramName = paramKey;
          if (!paramName) {
            logger.warn(
              `No 'name' found for parameter '${paramKey}' in file: ${parameterFilePath}, skipping...`,
            );
            return; // Skip if there's no valid name
          }

          // Convert parameter name to PascalCase for TypeScript type
          const paramTypeName = toPascalCase(paramName);

          // Generate the TypeScript type definition for the parameter
          const typeDefinition = generateParameterType(param, paramTypeName);

          // Add the generated type to the file content
          fileContentTs += `${typeDefinition}\n`;
        });

        // Ensure the output directory exists
        fs.mkdirSync(outputDir, { recursive: true });

        // Write the generated types to the file
        fs.writeFileSync(outputFilePath, fileContentTs, 'utf8');
        logger.info(`Generated parameter types for ${fileName}`);
      }
    });
  } catch (err) {
    logger.error('Error parsing parameter files', err);
  }
};
