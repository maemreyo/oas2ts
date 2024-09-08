import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import logger from '../../utils/logger';
import { loadFiles } from '../file';
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
 * Extracts the references for parameters from the API model and converts them into type names.
 *
 * @param parameters - The list of parameter references from the API model.
 * @param parametersDir - The directory where the parameters are located.
 * @returns An array of parameter names and types with the correct import path.
 */
const extractParameterRefs = (
  parameters: { $ref: string }[] | undefined,
  parametersDir: string,
): { paramName: string; paramType: string; importPath: string }[] => {
  if (!parameters) return [];

  return parameters.map((param) => {
    const paramFileName =
      param.$ref.split('/').pop()?.replace('.yaml', '') || '';
    const paramType = toPascalCaseAndRemoveDashes(paramFileName);
    const paramName = toCamelCaseFileName(paramFileName);

    // Detect if parameter is part of a larger file (e.g., Timeoff.ts)
    const importFileName = paramFileName.includes('timeoff')
      ? 'Timeoff'
      : paramType;

    const importPath = path.relative(
      parametersDir,
      path.join(parametersDir, `${importFileName}.ts`),
    );

    return { paramName, paramType, importPath };
  });
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
 * Parses API models, handling paths, responses, and parameters.
 *
 * @param inputDir - The directory containing API models (YAML or JSON files).
 * @param outputDir - The directory to output generated TypeScript types.
 * @param typesDir - The directory where the response types are located.
 * @param parametersDir - The directory where the parameter types are located.
 */
export const parseApiModels = (
  inputDir: string,
  outputDir: string,
  typesDir: string,
  parametersDir: string,
) => {
  try {
    const apiFiles = loadFiles(inputDir);

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
                // Extract parameter references
                const parameterRefs = extractParameterRefs(
                  details.parameters,
                  parametersDir,
                );

                // Prepare imports for parameters
                const parameterImports = parameterRefs.map(
                  ({ paramName, paramType, importPath }) => ({
                    paramName,
                    paramType,
                    importPath: importPath
                      .replace(/\\/g, '/')
                      .replace('.ts', ''),
                  }),
                );

                // Prepare parameter signatures for the function
                const parameters = parameterRefs.map(
                  ({ paramName, paramType }) => `${paramName}: ${paramType}`,
                );

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
                  parametersDir, // Directory where the parameter types are located
                  filename, // Corrected filename
                  parameterImports, // Parameter import statements
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
