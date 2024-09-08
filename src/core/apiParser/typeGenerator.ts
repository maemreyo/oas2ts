import * as path from 'path';
import { toPascalCaseAndRemoveDashes } from '../../utils/string';
import { findTypeInDirectory } from '../../utils/typeHelpers';

/**
 * Generates the TypeScript type definition for a success response.
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

  const responseTypeImport = createResponseTypeImport(
    apiOutputDir,
    typesDir,
    filename,
    responseType,
  );
  const parameterImportsString = createParameterImports(
    apiOutputDir,
    parametersDir,
    parameterImports,
  );

  return `${responseTypeImport}\n${parameterImportsString}\n\nexport type ${functionName} = (${paramList}) => Promise<${responseType}>;`;
};

/**
 * Creates the import statement for the response type.
 */
const createResponseTypeImport = (
  apiOutputDir: string,
  typesDir: string,
  filename: string,
  responseType: string,
): string => {
  const relativeTypesPath = path.relative(
    apiOutputDir,
    path.join(typesDir, `${filename}.ts`),
  );
  return `import { ${responseType} } from '${normalizePath(relativeTypesPath)}';`;
};

/**
 * Creates the import statements for parameters.
 */
const createParameterImports = (
  apiOutputDir: string,
  parametersDir: string,
  parameterImports: {
    paramName: string;
    paramType: string;
    importPath: string;
  }[],
): string => {
  return parameterImports
    .map(({ paramType }) => {
      const importPath = findParameterImportPath(
        paramType,
        apiOutputDir,
        parametersDir,
      );
      return `import { ${paramType} } from '${importPath}';`;
    })
    .join('\n');
};

/**
 * Finds the correct import path for a parameter type.
 */
const findParameterImportPath = (
  paramType: string,
  apiOutputDir: string,
  parametersDir: string,
): string => {
  const sourceFileInfo = findTypeInDirectory(parametersDir, paramType);
  const paramFilePath = sourceFileInfo
    ? path.join(parametersDir, `${sourceFileInfo.fileName}.ts`)
    : path.join(parametersDir, `${paramType}.ts`);

  const relativeParamsPath = path.relative(apiOutputDir, paramFilePath);
  return normalizePath(relativeParamsPath);
};

/**
 * Normalizes file path for TypeScript imports (removes .ts extension and handles Windows paths).
 */
const normalizePath = (filePath: string): string => {
  return filePath.replace(/\\/g, '/').replace('.ts', '');
};
