"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTypeFiles = void 0;
const fs = __importStar(require("fs/promises"));
const path = __importStar(require("path"));
const schemaParser_1 = require("../schemaParser");
const config_1 = require("../../config");
const logger_1 = __importDefault(require("../../shared/logger"));
const oas2ts_config_1 = __importDefault(require("../../oas2ts.config"));
const string_1 = require("../../utils/string");
const schemaTypeGenerator_1 = require("../../infrastructure/typeNameHandler/schemaTypeGenerator");
const constants_1 = require("../../utils/constants");
const enums_1 = require("../../utils/enums");
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
const writeFile = async (filePath, content) => {
    try {
        await fs.writeFile(filePath, content);
        logger_1.default.info(`File written successfully: ${filePath}`);
    }
    catch (error) {
        logger_1.default.error(`Error writing file ${filePath}`, error);
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
const generateBaseFile = async () => {
    const outputPath = path.join(config_1.config.outputDirectory, constants_1.BASE_FILE_NAME);
    let baseFileContent = '';
    // Loop through each baseType in the config and generate type aliases
    Object.entries(oas2ts_config_1.default.baseType).forEach(([typeName, { type }]) => {
        baseFileContent += constants_1.TYPE_ALIAS_TEMPLATE.replace('${typeName}', typeName).replace('${type}', type);
    });
    // Write the generated content to base.ts
    await writeFile(outputPath, baseFileContent);
    logger_1.default.info(constants_1.BASE_FILE_GENERATED_MESSAGE);
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
const processSchemaFile = async (schemaPath) => {
    try {
        const schemaFileName = path.basename(schemaPath, path.extname(schemaPath));
        const parsedSchema = (0, schemaParser_1.parseSchema)(schemaPath);
        let typesContent = '';
        const imports = new Set(); // Set to store import lines
        // Handle cases where parsedSchema is empty or a general object
        if (Object.keys(parsedSchema).length === 0 ||
            parsedSchema.type === enums_1.SchemaTypes.OBJECT) {
            parsedSchema[schemaFileName] = parsedSchema;
        }
        // Generate types for each schema in the file
        Object.keys(parsedSchema).forEach((schemaName) => {
            const schema = parsedSchema[schemaName];
            const types = (0, schemaTypeGenerator_1.generateTypesForSchema)(schemaName, schema, imports, schemaFileName);
            typesContent += `${types}\n`; // Combine all types into one file
        });
        // Generate the output file name (e.g., location.yaml -> location.ts)
        const fileName = `${(0, string_1.toCamelCase)(schemaFileName)}.ts`;
        // Output file path
        const outputPath = path.join(config_1.config.outputDirectory, fileName);
        // Remove duplicate imports (ensured by using Set, but sorting)
        const importsString = Array.from(imports).sort().join('\n');
        // Combine imports and types into the final file content
        const finalContent = `${importsString}${constants_1.IMPORTS_AND_TYPES_SEPARATOR}${typesContent}`;
        // Write all types and interfaces to the output file
        await writeFile(outputPath, finalContent);
        logger_1.default.info(`${constants_1.FILE_GENERATED_SUCCESSFULLY}: ${schemaFileName} -> ${fileName}`);
    }
    catch (error) {
        // Log the error but continue processing the next schema
        logger_1.default.error(`${constants_1.ERROR_GENERATING_TYPES} ${schemaPath}`, error);
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
const generateTypeFiles = async (schemas) => {
    await generateBaseFile();
    // Process each schema file asynchronously
    await Promise.all(schemas.map((schemaPath) => processSchemaFile(schemaPath)));
};
exports.generateTypeFiles = generateTypeFiles;
