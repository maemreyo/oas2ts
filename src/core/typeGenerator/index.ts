import * as fs from 'fs';
import * as path from 'path';
import { parseSchema } from '../schemaParser';
import { generateTypesForSchema } from '../../infrastructure/typeNameHandler';
import { config } from '../../config';
import logger from '../../shared/logger';
import { toCamelCase } from '../../utils/string';

// Generate TypeScript types from schema files
export const generateTypeFiles = (schemas: string[]): void => {
  schemas.forEach((schemaPath) => {
    try {
      // Read the schema file name (e.g., location.yaml -> location)
      const schemaFileName = path.basename(
        schemaPath,
        path.extname(schemaPath),
      );
      const parsedSchema = parseSchema(schemaPath);

      let typesContent = '';
      const imports: Set<string> = new Set(); // Set to store import lines

      // Handle cases where parsedSchema is empty or a general object
      if (
        Object.keys(parsedSchema).length === 0 ||
        parsedSchema.type === 'object'
      ) {
        // Map the entire parsedSchema to an object with the file name as the key
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
        typesContent += types + '\n'; // Combine all types into one file
      });

      // Generate the output file name (e.g., location.yaml -> location.ts)
      const fileName = toCamelCase(schemaFileName) + '.ts';

      // Output file path
      const outputPath = path.join(config.outputDirectory, fileName);

      // Sorted string of imports
      const importsString = Array.from(imports).sort().join('\n');

      // Combine imports and types into the final file content
      const finalContent = `${importsString}\n\n${typesContent}`;

      // Write all types and interfaces to the output file
      fs.writeFileSync(outputPath, finalContent);
      logger.info(
        `Types generated successfully for schema file: ${schemaFileName} -> ${fileName}`,
      );
    } catch (error) {
      // Log the error but continue processing the next schema
      logger.error(`Error generating types for schema ${schemaPath}`, error);
    }
  });
};
