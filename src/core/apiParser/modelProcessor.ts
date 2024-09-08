import { loadFiles } from '../file';
import { parseApiFile } from './fileParser';
import { extractSuccessResponseRef } from './responseExtractor';
import { extractParameterRefs } from './parameterExtractor';
import { generateTypeForSuccessResponse } from './typeGenerator';
import {
  ensureDirectoryExists,
  toPascalCaseAndRemoveDashes,
} from '../../utils/string';
import * as path from 'path';
import * as fs from 'fs';
import logger from '../../utils/logger';
import { mapParamImports, mapParamSignatures } from './paramMapper';
import { resolveResponseType, resolveFileName } from './refResolver';
import { resolveOutputFolder } from './outputHelper';

/**
 * Processes a single API file.
 */
const handleApiFile = (
  filePath: string,
  outputDir: string,
  typesDir: string,
  paramsDir: string,
) => {
  const apiModel = parseApiFile(filePath);
  if (!apiModel) return;

  Object.entries(apiModel).forEach(([method, apiDetails]) => {
    try {
      const details = apiDetails as {
        responses?: Record<string, any>;
        parameters?: { $ref: string }[];
        operationId?: string;
        tags?: string[];
      };

      if (details.responses) {
        handleApiDetails(details, outputDir, typesDir, paramsDir);
      }
    } catch (err) {
      logger.error(
        `Error processing API details for method ${method} in file ${filePath}`,
        err,
      );
    }
  });
};

/**
 * Processes the details of an API method.
 */
const handleApiDetails = (
  details: {
    responses?: Record<string, any>;
    parameters?: { $ref: string }[];
    operationId?: string;
    tags?: string[];
  },
  outputDir: string,
  typesDir: string,
  paramsDir: string,
) => {
  const successResponseRef = extractSuccessResponseRef(details.responses || {});

  if (successResponseRef) {
    const paramRefs = extractParameterRefs(details.parameters, paramsDir);

    const imports = mapParamImports(paramRefs, paramsDir);
    const paramSignatures = mapParamSignatures(paramRefs);

    const responseType = resolveResponseType(successResponseRef);
    const fileName = resolveFileName(successResponseRef);

    const outputFolder = resolveOutputFolder(
      outputDir,
      details.tags || ['default'],
    );
    ensureDirectoryExists(outputFolder);

    generateTypeFile(
      details.operationId || 'unknownOperation',
      paramSignatures,
      responseType,
      outputFolder,
      typesDir,
      paramsDir,
      fileName,
      imports,
    );
  }
};

/**
 * Generates and writes the TypeScript type file.
 */
const generateTypeFile = (
  operationId: string,
  paramSignatures: string[],
  responseType: string,
  outputFolder: string,
  typesDir: string,
  paramsDir: string,
  fileName: string,
  imports: { paramName: string; paramType: string; importPath: string }[],
) => {
  const typeDefinition = generateTypeForSuccessResponse(
    operationId,
    paramSignatures,
    responseType,
    outputFolder,
    typesDir,
    paramsDir,
    fileName,
    imports,
  );

  const outputFileName = `${toPascalCaseAndRemoveDashes(operationId)}.ts`;
  const outputFilePath = path.join(outputFolder, outputFileName);

  fs.writeFileSync(outputFilePath, typeDefinition, 'utf8');
  logger.debug(`Generated type for ${operationId}: \n${typeDefinition}`);
};

/**
 * Entry point to parse API models.
 */
export const parseApiModels = (
  inputDir: string,
  outputDir: string,
  typesDir: string,
  paramsDir: string,
) => {
  try {
    const apiFiles = loadFiles(inputDir);

    apiFiles.forEach((filePath) => {
      handleApiFile(filePath, outputDir, typesDir, paramsDir);
    });
  } catch (err) {
    logger.error('Error parsing API models', err);
  }
};
