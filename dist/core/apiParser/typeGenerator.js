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
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTypeForSuccessResponse = void 0;
const path = __importStar(require("path"));
const string_1 = require("../../utils/string");
const typeHelpers_1 = require("../../utils/typeHelpers");
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
const generateTypeForSuccessResponse = (operationId, parameters, responseType, apiOutputDir, typesDir, parametersDir, filename, parameterImports) => {
    const functionName = `${(0, string_1.toPascalCaseAndRemoveDashes)(operationId)}Request`;
    const paramList = parameters.join(', ');
    const responseTypeImport = createResponseTypeImport(apiOutputDir, typesDir, filename, responseType);
    const parameterImportsString = createParameterImports(apiOutputDir, parametersDir, parameterImports);
    return `${responseTypeImport}\n${parameterImportsString}\n\nexport type ${functionName} = (${paramList}) => Promise<${responseType}>;`;
};
exports.generateTypeForSuccessResponse = generateTypeForSuccessResponse;
/**
 * Creates the import statement for the response type.
 */
const createResponseTypeImport = (apiOutputDir, typesDir, filename, responseType) => {
    const relativeTypesPath = path.relative(apiOutputDir, path.join(typesDir, `${filename}.ts`));
    return `import { ${responseType} } from '${normalizePath(relativeTypesPath)}';`;
};
/**
 * Creates the import statements for parameters.
 */
const createParameterImports = (apiOutputDir, parametersDir, parameterImports) => {
    return parameterImports
        .map(({ paramType }) => {
        const importPath = findParameterImportPath(paramType, apiOutputDir, parametersDir);
        return `import { ${paramType} } from '${importPath}';`;
    })
        .join('\n');
};
/**
 * Finds the correct import path for a parameter type.
 */
const findParameterImportPath = (paramType, apiOutputDir, parametersDir) => {
    const sourceFileInfo = (0, typeHelpers_1.findTypeInDirectory)(parametersDir, paramType);
    const paramFilePath = sourceFileInfo
        ? path.join(parametersDir, `${sourceFileInfo.fileName}.ts`)
        : path.join(parametersDir, `${paramType}.ts`);
    const relativeParamsPath = path.relative(apiOutputDir, paramFilePath);
    return normalizePath(relativeParamsPath);
};
/**
 * Normalizes file path for TypeScript imports (removes .ts extension and handles Windows paths).
 */
const normalizePath = (filePath) => {
    return filePath.replace(/\\/g, '/').replace('.ts', '');
};
