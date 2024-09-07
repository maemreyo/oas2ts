import * as path from 'path';
import logger from '../../utils/logger';
import {
  toCamelCaseParam,
  toPascalCaseAndRemoveDashes,
} from '../../utils/string';

/**
 * Generates the TypeScript type definition for a success response, converting operationId and parameters.
 * Also generates an import statement for the response type, with proper relative path calculation.
 *
 * @param operationId - The operation ID of the API endpoint.
 * @param parameters - The list of parameters, usually taken from the API path.
 * @param responseType - The type of the response schema (taken from $ref).
 * @param apiOutputDir - The directory where the API types are generated.
 * @param typesDir - The directory where the response types are located (from config.outputDirectory).
 * @param filename - The camelCase filename based on the $ref schema path.
 * @returns The TypeScript type definition for the API endpoint.
 */
export const generateTypeForSuccessResponse = (
  operationId: string,
  parameters: string[],
  responseType: string,
  apiOutputDir: string,
  typesDir: string,
  filename: string,
): string => {
  const functionName = `${toPascalCaseAndRemoveDashes(operationId)}Request`;
  const paramList = parameters.map(toCamelCaseParam).join(', ');

  // Calculate the relative path from API output directory to the types directory
  const relativePath = path.relative(
    apiOutputDir,
    path.join(typesDir, `${filename}.ts`), // Use the provided filename
  );

  // Create the import statement with the calculated relative path and remove the .ts extension
  const importStatement = `import { ${responseType} } from '${relativePath.replace(/\\/g, '/').replace('.ts', '')}';\n`;

  // Return the final TypeScript type definition
  return `${importStatement}export type ${functionName} = (${paramList}) => Promise<${responseType}>;`;
};
