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
exports.parseParameterFiles = void 0;
const path = __importStar(require("path"));
const logger_1 = __importDefault(require("../../utils/logger"));
const yaml_1 = require("../yaml");
const file_1 = require("../file");
const string_1 = require("../../utils/string");
const typeGenerator_1 = require("./typeGenerator");
const directory_1 = require("../../utils/directory");
/**
 * Parses parameter files and generates TypeScript types for them.
 *
 * @param inputDir - The directory containing parameter YAML files.
 * @param outputDir - The directory to output the generated TypeScript types.
 */
const parseParameterFiles = (inputDir, outputDir) => {
    try {
        const parameterFiles = (0, file_1.loadFiles)(inputDir);
        parameterFiles.forEach((filePath) => {
            processParameterFile(filePath, outputDir);
        });
    }
    catch (err) {
        logger_1.default.error('Error parsing parameter files', err);
    }
};
exports.parseParameterFiles = parseParameterFiles;
/**
 * Processes a single parameter file by parsing its content
 * and generating TypeScript types for the parameters it defines.
 *
 * @param filePath - The file path of the YAML file to be processed.
 * @param outputDir - The directory where the output TypeScript file will be written.
 */
const processParameterFile = (filePath, outputDir) => {
    try {
        const fileContent = (0, yaml_1.readYamlFileContent)(filePath);
        const parameters = (0, yaml_1.parseYamlFile)(filePath);
        const fileName = path.basename(filePath, path.extname(filePath));
        const outputFilePath = buildOutputPath(outputDir, fileName);
        if (parameters?.name) {
            processSingleParameter(parameters, outputFilePath, outputDir);
        }
        else {
            processMultipleParameters(parameters, outputFilePath, outputDir);
        }
    }
    catch (err) {
        logger_1.default.error(`Error processing parameter file ${filePath}`, err);
    }
};
/**
 * Generates the output file path based on the file name and output directory.
 *
 * @param outputDir - The directory where the output TypeScript file will be written.
 * @param fileName - The base name of the output file (without extension).
 * @returns The full path to the output file.
 */
const buildOutputPath = (outputDir, fileName) => {
    const outputFileName = `${(0, string_1.toPascalCase)(fileName)}.ts`;
    logger_1.default.info({ outputFileName });
    return path.join(outputDir, outputFileName);
};
/**
 * Processes a single parameter and generates the corresponding TypeScript type.
 *
 * @param param - The parameter object.
 * @param outputFilePath - The path where the TypeScript file will be written.
 * @param outputDir - The output directory.
 */
const processSingleParameter = (param, outputFilePath, outputDir) => {
    const paramName = (0, string_1.toPascalCase)(param.name);
    const typeDefinition = (0, typeGenerator_1.generateParameterType)(param, paramName);
    (0, directory_1.ensureDirectoryExists)(outputDir);
    (0, file_1.writeToFile)(outputFilePath, typeDefinition);
    logger_1.default.info(`Generated parameter type for ${paramName}`);
};
/**
 * Processes multiple parameters and generates corresponding TypeScript types.
 *
 * @param parameters - The object containing multiple parameters.
 * @param outputFilePath - The path where the TypeScript file will be written.
 * @param outputDir - The output directory.
 */
const processMultipleParameters = (parameters, outputFilePath, outputDir) => {
    let fileContentTs = '';
    Object.entries(parameters).forEach(([paramKey, paramValue]) => {
        const param = paramValue;
        const paramName = paramKey;
        if (!paramName) {
            logger_1.default.warn(`No 'name' found for parameter '${paramKey}', skipping...`);
            return; // Skip if there's no valid name
        }
        const paramTypeName = (0, string_1.toPascalCase)(paramName);
        const typeDefinition = (0, typeGenerator_1.generateParameterType)(param, paramTypeName);
        fileContentTs += `${typeDefinition}\n`;
    });
    (0, directory_1.ensureDirectoryExists)(outputDir);
    (0, file_1.writeToFile)(outputFilePath, fileContentTs);
    logger_1.default.info(`Generated parameter types for multiple properties`);
};
