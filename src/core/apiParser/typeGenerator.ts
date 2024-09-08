import * as path from 'path';
import logger from '../../utils/logger';
import {
  toCamelCaseParam,
  toPascalCaseAndRemoveDashes,
} from '../../utils/string';
import { findTypeInDirectory } from '../../utils/typeHelpers';

/**
 * Generates the TypeScript type definition for a success response, converting operationId and parameters.
 * Also generates import statements for the response type and parameters, with proper relative path calculation.
 *
 * @param operationId - The operation ID of the API endpoint.
 * @param parameters - The list of parameters with their TypeScript types.
 * @param responseType - The type of the response schema (taken from $ref).
 * @param apiOutputDir - The directory where the API types are generated.
 * @param typesDir - The directory where the response types are located.
 * @param parametersDir - The directory where the parameter types are located.
 * @param filename - The camelCase filename based on the $ref schema path.
 * @param parameterImports - An array of imports for parameters, includes the file where the type is defined.
 * @returns The TypeScript type definition for the API endpoint.
 */
export const generateTypeForSuccessResponse = (
  operationId: string,
  parameters: string[],
  responseType: string,
  apiOutputDir: string,
  typesDir: string,
  parametersDir: string,
  filename: string,
  parameterImports: {
    paramName: string;
    paramType: string;
    importPath: string;
  }[],
): string => {
  const functionName = `${toPascalCaseAndRemoveDashes(operationId)}Request`;
  const paramList = parameters.join(', ');

  // Calculate the relative path from API output directory to the types directory
  const relativeTypesPath = path.relative(
    apiOutputDir,
    path.join(typesDir, `${filename}.ts`),
  );

  // Create the import statement for the response type
  const importStatement = `import { ${responseType} } from '${relativeTypesPath.replace(/\\/g, '/').replace('.ts', '')}';\n`;
  logger.info({
    '>>>>>>>>>>>> parameterImports <<<<<<<<<<<<<': parameterImports,
  });
  // Create import statements for parameters, accounting for those defined in a larger file
  const parameterImportStatements = parameterImports
    .map(({ paramType }) => {
      const sourceFileInfo = findTypeInDirectory(parametersDir, paramType);
      const paramFilePath = sourceFileInfo
        ? `${sourceFileInfo.fileName}.ts`
        : `${paramType}.ts`; // If the type is defined in a larger file, use the larger file
      const relativeParamsPath = path.relative(
        apiOutputDir,
        path.join(parametersDir, paramFilePath),
      ); // Adjust path accordingly
      return `import { ${paramType} } from '${relativeParamsPath.replace(/\\/g, '/').replace('.ts', '')}';`;
    })
    .join('\n');

  // Return the final TypeScript type definition with a blank line after imports
  return `${importStatement}${parameterImportStatements}\n\nexport type ${functionName} = (${paramList}) => Promise<${responseType}>;`;
};
