import * as fs from 'fs/promises';
import * as path from 'path';
import { parseSchema } from '../schemaParser';
import { config as appConfig } from '../../config';
import logger from '../../shared/logger';
import config from '../../oas2ts.config';
import { toCamelCase } from '../../utils/string';
import { generateTypesForSchema } from '../../infrastructure/typeNameHandler/schemaTypeGenerator';
import {
  BASE_FILE_NAME,
  BASE_FILE_GENERATED_MESSAGE,
  TYPE_ALIAS_TEMPLATE,
  FILE_GENERATED_SUCCESSFULLY,
  ERROR_GENERATING_TYPES,
  IMPORTS_AND_TYPES_SEPARATOR,
} from '../../utils/constants';
import { SchemaTypes } from '../../utils/enums';

/**
 * Asynchronously writes content to a file.
 *
 * @param filePath - The path where the file will be created.
 * @param content - The content to write into the file.
 * @returns A promise that resolves when the file is successfully written.
 *
 * @example
 * ```typescript
 * await writeFile('/path/to/file.ts', 'const a = 1;');
 * ```
 */
const writeFile = async (filePath: string, content: string): Promise<void> => {
  try {
    await fs.writeFile(filePath, content);
    logger.info(`File written successfully: ${filePath}`);
  } catch (error) {
    logger.error(`Error writing file ${filePath}`, error);
  }
};

/**
 * Dynamically generates the `base.ts` file based on the configuration.
 *
 * Loops through all base types defined in the `oas2ts.config` file and generates
 * corresponding type aliases in the `base.ts` file.
 *
 * @returns A promise that resolves when the `base.ts` file is successfully written.
 *
 * @example
 * ```typescript
 * await generateBaseFile();
 * ```
 */
const generateBaseFile = async (): Promise<void> => {
  const outputPath = path.join(appConfig.outputDirectory, BASE_FILE_NAME);
  let baseFileContent = '';

  // Loop through each baseType in the config and generate type aliases
  Object.entries(config.baseType).forEach(([typeName, { type }]) => {
    baseFileContent += TYPE_ALIAS_TEMPLATE.replace(
      '${typeName}',
      typeName,
    ).replace('${type}', type);
  });

  // Write the generated content to base.ts
  await writeFile(outputPath, baseFileContent);
  logger.info(BASE_FILE_GENERATED_MESSAGE);
};

/**
 * Processes a single schema file, parses it, and generates the corresponding TypeScript types.
 *
 * For each schema, it generates types and interfaces and writes them to a `.ts` file.
 * It also handles imports and ensures that they are correctly formatted and deduplicated.
 *
 * @param schemaPath - The path to the schema file to be processed.
 * @returns A promise that resolves when the schema file has been successfully processed.
 *
 * @example
 * ```typescript
 * await processSchemaFile('/path/to/schema.yaml');
 * ```
 */
const processSchemaFile = async (schemaPath: string): Promise<void> => {
  try {
    const schemaFileName = path.basename(schemaPath, path.extname(schemaPath));
    const parsedSchema = parseSchema(schemaPath);

    let typesContent = '';
    const imports: Set<string> = new Set(); // Set to store import lines

    // Handle cases where parsedSchema is empty or a general object
    if (
      Object.keys(parsedSchema).length === 0 ||
      parsedSchema.type === SchemaTypes.OBJECT
    ) {
      parsedSchema[schemaFileName] = parsedSchema;
    }

    // Generate types for each schema in the file
    Object.keys(parsedSchema).forEach((schemaName) => {
      const schema = parsedSchema[schemaName];
      const types = generateTypesForSchema(
        schemaName,
        schema,
        imports,
        schemaFileName,
      );
      typesContent += `${types}\n`; // Combine all types into one file
    });

    // Generate the output file name (e.g., location.yaml -> location.ts)
    const fileName = `${toCamelCase(schemaFileName)}.ts`;

    // Output file path
    const outputPath = path.join(appConfig.outputDirectory, fileName);

    // Remove duplicate imports (ensured by using Set, but sorting)
    const importsString = Array.from(imports).sort().join('\n');

    // Combine imports and types into the final file content
    const finalContent = `${importsString}${IMPORTS_AND_TYPES_SEPARATOR}${typesContent}`;

    // Write all types and interfaces to the output file
    await writeFile(outputPath, finalContent);

    logger.info(
      `${FILE_GENERATED_SUCCESSFULLY}: ${schemaFileName} -> ${fileName}`,
    );
  } catch (error) {
    // Log the error but continue processing the next schema
    logger.error(`${ERROR_GENERATING_TYPES} ${schemaPath}`, error);
  }
};

/**
 * Generates TypeScript types from an array of schema files.
 *
 * This function first generates a `base.ts` file and then processes each schema file
 * in parallel. For each schema, it generates TypeScript types and interfaces and writes
 * them to separate `.ts` files.
 *
 * @param schemas - Array of schema file paths to be processed.
 * @returns A promise that resolves when all schema files have been successfully processed.
 *
 * @example
 * ```typescript
 * await generateTypeFiles(['/path/to/schema1.yaml', '/path/to/schema2.yaml']);
 * ```
 */
export const generateTypeFiles = async (schemas: string[]): Promise<void> => {
  await generateBaseFile();

  // Process each schema file asynchronously
  await Promise.all(schemas.map((schemaPath) => processSchemaFile(schemaPath)));
};
