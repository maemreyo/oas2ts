import * as path from 'path';
import {
  toCamelCaseFileName,
  toPascalCaseAndRemoveDashes,
} from '../../utils/string';

/**
 * Extracts the references for parameters from the API model and converts them into type names.
 *
 * @param parameters - The list of parameter references from the API model.
 * @param parametersDir - The directory where the parameters are located.
 * @returns An array of parameter names and types with the correct import path.
 */
export const extractParameterRefs = (
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
