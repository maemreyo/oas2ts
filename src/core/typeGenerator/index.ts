import * as fs from 'fs';
import * as path from 'path';
import { parseSchema } from '../schemaParser';
import { generateTypesForSchema } from '../../infrastructure/typeNameHandler';
import { config } from '../../config';
import logger from '../../shared/logger';

// Chuyển đổi tên file sang dạng camelCase
const toCamelCase = (str: string): string => {
  return str.replace(/([-_][a-z])/g, (group) =>
    group.toUpperCase().replace('-', '').replace('_', ''),
  );
};

// Generate TypeScript types from schema files
export const generateTypeFiles = (schemas: string[]): void => {
  schemas.forEach((schemaPath) => {
    try {
      // Đọc tên file schema (vd: location.yaml -> location)
      const schemaFileName = path.basename(
        schemaPath,
        path.extname(schemaPath),
      );
      const parsedSchema = parseSchema(schemaPath);

      let typesContent = '';
      const imports: Set<string> = new Set(); // Set để lưu trữ các dòng import

      // Trường hợp parsedSchema không có key nào rõ ràng (không có schema/module)
      if (
        Object.keys(parsedSchema).length === 0 ||
        parsedSchema.type === 'object'
      ) {
        // Map toàn bộ parsedSchema thành object với key là tên file
        parsedSchema[schemaFileName] = parsedSchema;
      }

      // Sinh types cho từng schema trong file
      Object.keys(parsedSchema).forEach((schemaName) => {
        const schema = parsedSchema[schemaName];
        const types = generateTypesForSchema(
          schemaName,
          schema,
          imports,
          schemaFileName,
        );
        typesContent += types + '\n'; // Tích hợp tất cả types vào một file
      });

      // Tạo tên file output (vd: location.yaml -> location.ts)
      const fileName = toCamelCase(schemaFileName) + '.ts';

      // Đường dẫn file đầu ra
      const outputPath = path.join(config.outputDirectory, fileName);

      // Chuỗi các dòng import đã sắp xếp
      const importsString = Array.from(imports).sort().join('\n');

      // Kết hợp imports và types vào nội dung cuối cùng của file
      const finalContent = `${importsString}\n\n${typesContent}`;

      // Write all types and interfaces to the output file
      fs.writeFileSync(outputPath, finalContent);
      logger.info(
        `Types generated successfully for schema file: ${schemaFileName} -> ${fileName}`,
      );
    } catch (error) {
      // Log the error but continue with the next schema
      logger.error(`Error generating types for schema ${schemaPath}`, error);
    }
  });
};
