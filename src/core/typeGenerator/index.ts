import {
  applyInterfaceNamingConvention,
  applyPropertyNamingConvention,
} from '../../shared/namingConvention';
import { generateOutputFileName } from '../../infrastructure/fileNameHandler';
import { parseSchema, handleSpecialTypes } from '../schemaParser';
import * as fs from 'fs-extra';
import * as path from 'path';

export function generateTypeScriptInterface(
  schemaName: string,
  properties: any,
): string {
  const lines = Object.keys(properties).map((propName) => {
    const prop = properties[propName];
    const tsType = handleSpecialTypes(prop) || 'any';
    const requiredFlag = prop.required ? '' : '?';
    return `  ${applyPropertyNamingConvention(propName)}${requiredFlag}: ${tsType};`;
  });

  const interfaceName = applyInterfaceNamingConvention(schemaName);
  return `export interface ${interfaceName} {\n${lines.join('\n')}\n}`;
}

export async function generateTypeScriptFiles(
  resolvedData: any,
  outputDir: string,
) {
  if (resolvedData.components && resolvedData.components.schemas) {
    for (const schemaName in resolvedData.components.schemas) {
      const schema = resolvedData.components.schemas[schemaName];
      const properties = schema.properties || {};
      const tsInterface = generateTypeScriptInterface(schemaName, properties);

      const outputFilePath = path.join(
        outputDir,
        generateOutputFileName(schemaName),
      );
      await fs.writeFile(outputFilePath, tsInterface, 'utf8');
    }
  }
}
