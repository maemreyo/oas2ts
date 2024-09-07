import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import logger from '../../utils/logger';
import { loadFiles } from '../fileLoader';
import {
  ensureDirectoryExists,
  toCamelCaseFileName,
  toPascalCaseAndRemoveDashes,
} from '../../utils/string';
import { generateTypeForSuccessResponse } from './typeGenerator';

/**
 * Extracts the reference to the success response (status 200) from the responses section.
 *
 * @param responses - The responses object containing all possible HTTP responses.
 * @returns The reference to the success response (status 200) if found.
 */
const extractSuccessResponseRef = (
  responses: Record<string, any>,
): string | undefined => {
  const successResponse = responses['200'];
  if (
    successResponse &&
    successResponse.content &&
    successResponse.content['application/json']
  ) {
    const schema = successResponse.content['application/json'].schema;
    if (schema && schema.$ref) {
      return schema.$ref; // Return the $ref pointing to the success schema
    }
  }
  return undefined;
};

/**
 * Parses an API model file (YAML or JSON).
 *
 * @param filePath - The path to the API model file.
 * @returns Parsed content of the file as an object.
 */
const parseApiFile = (filePath: string): any => {
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

/**
 * Parses API models, handling paths, responses, and tags.
 *
 * @param inputDir - The directory containing API models (YAML or JSON files).
 * @param outputDir - The directory to output generated TypeScript types.
 * @param typesDir - The directory where the response types are located.
 */
export const parseApiModels = (
  inputDir: string,
  outputDir: string,
  typesDir: string,
) => {
  try {
    const apiFiles = loadFiles(inputDir); // This is recursive now

    apiFiles.forEach((apiFilePath) => {
      const apiModel = parseApiFile(apiFilePath);

      if (apiModel) {
        Object.entries(apiModel).forEach(([method, apiDetails]) => {
          try {
            const details = apiDetails as {
              responses?: Record<string, any>;
              parameters?: { $ref: string }[];
              operationId?: string;
              tags?: string[];
            };

            if (details.responses) {
              const successResponseRef = extractSuccessResponseRef(
                details.responses,
              );
              if (successResponseRef) {
                const parameters =
                  details.parameters?.map((param) => {
                    return (
                      param.$ref.split('/').pop()?.replace('.yaml', '') || ''
                    );
                  }) || [];

                // Get response type and its filename from the $ref
                const responseType =
                  successResponseRef.split('/').pop()?.replace('.yaml', '') ||
                  'unknown';
                const filename = toCamelCaseFileName(
                  successResponseRef.split('#')[0].split('/').pop() || '',
                ); // Convert filename from ref to camelCase

                // Get tags to organize folder structure
                const tags = details.tags || ['default'];
                const outputFolder = path.join(outputDir, ...tags); // Create subfolders based on tags
                ensureDirectoryExists(outputFolder); // Ensure the folder exists

                // Generate the import path for the response type from the typesDir
                const typeDefinition = generateTypeForSuccessResponse(
                  details.operationId || 'unknownOperation',
                  parameters,
                  responseType,
                  outputFolder, // Current API output directory
                  typesDir, // Directory where the response types are located
                  filename, // Corrected filename
                );

                // Use PascalCase for the filename
                const outputFileName = `${toPascalCaseAndRemoveDashes(
                  details.operationId || 'unknown',
                )}.ts`;
                const outputFilePath = path.join(outputFolder, outputFileName);

                // Write the file
                fs.writeFileSync(outputFilePath, typeDefinition, 'utf8');
                logger.debug(
                  `Generated type for ${details.operationId}: \n${typeDefinition}`,
                );
              }
            }
          } catch (err) {
            logger.error(
              `Error processing API details for method ${method} in file ${apiFilePath}`,
              err,
            );
          }
        });
      }
    });
  } catch (err) {
    logger.error('Error parsing API models', err);
  }
};
