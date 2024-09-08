import * as path from 'path';
import logger from '../../utils/logger';
import { Parameter } from './types';
import { readYamlFileContent, parseYamlFile } from '../yaml';
import { writeToFile, loadFiles } from '../file';
import { ensureDirectoryExists, toPascalCase } from '../../utils/string';
import { generateParameterType } from './typeGenerator';

/**
 * Parses parameter files and generates TypeScript types for them.
 *
 * @param inputDir - The directory containing parameter YAML files.
 * @param outputDir - The directory to output the generated TypeScript types.
 */
export const parseParameterFiles = (inputDir: string, outputDir: string) => {
  try {
    const parameterFiles = loadFiles(inputDir);

    parameterFiles.forEach((filePath) => {
      processParameterFile(filePath, outputDir);
    });
  } catch (err) {
    logger.error('Error parsing parameter files', err);
  }
};

/**
 * Processes a single parameter file by parsing its content
 * and generating TypeScript types for the parameters it defines.
 *
 * @param filePath - The file path of the YAML file to be processed.
 * @param outputDir - The directory where the output TypeScript file will be written.
 */
const processParameterFile = (filePath: string, outputDir: string) => {
  try {
    const fileContent = readYamlFileContent(filePath);
    const parameters = parseYamlFile(filePath);

    const fileName = path.basename(filePath, path.extname(filePath));
    const outputFilePath = buildOutputPath(outputDir, fileName);

    if (parameters?.name) {
      processSingleParameter(parameters, outputFilePath, outputDir);
    } else {
      processMultipleParameters(parameters, outputFilePath, outputDir);
    }
  } catch (err) {
    logger.error(`Error processing parameter file ${filePath}`, err);
  }
};

/**
 * Generates the output file path based on the file name and output directory.
 *
 * @param outputDir - The directory where the output TypeScript file will be written.
 * @param fileName - The base name of the output file (without extension).
 * @returns The full path to the output file.
 */
const buildOutputPath = (outputDir: string, fileName: string): string => {
  const outputFileName = `${toPascalCase(fileName)}.ts`;
  logger.info({ outputFileName });
  return path.join(outputDir, outputFileName);
};

/**
 * Processes a single parameter and generates the corresponding TypeScript type.
 *
 * @param param - The parameter object.
 * @param outputFilePath - The path where the TypeScript file will be written.
 * @param outputDir - The output directory.
 */
const processSingleParameter = (
  param: Parameter,
  outputFilePath: string,
  outputDir: string,
) => {
  const paramName = toPascalCase(param.name);
  const typeDefinition = generateParameterType(param, paramName);

  ensureDirectoryExists(outputDir);
  writeToFile(outputFilePath, typeDefinition);
  logger.info(`Generated parameter type for ${paramName}`);
};

/**
 * Processes multiple parameters and generates corresponding TypeScript types.
 *
 * @param parameters - The object containing multiple parameters.
 * @param outputFilePath - The path where the TypeScript file will be written.
 * @param outputDir - The output directory.
 */
const processMultipleParameters = (
  parameters: Record<string, any>,
  outputFilePath: string,
  outputDir: string,
) => {
  let fileContentTs = '';

  Object.entries(parameters).forEach(([paramKey, paramValue]) => {
    const param = paramValue as Parameter;
    const paramName = paramKey;

    if (!paramName) {
      logger.warn(`No 'name' found for parameter '${paramKey}', skipping...`);
      return; // Skip if there's no valid name
    }

    const paramTypeName = toPascalCase(paramName);
    const typeDefinition = generateParameterType(param, paramTypeName);
    fileContentTs += `${typeDefinition}\n`;
  });

  ensureDirectoryExists(outputDir);
  writeToFile(outputFilePath, fileContentTs);
  logger.info(`Generated parameter types for multiple properties`);
};
