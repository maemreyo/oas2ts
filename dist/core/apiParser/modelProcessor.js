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
exports.parseApiModels = void 0;
const file_1 = require("../file");
const fileParser_1 = require("./fileParser");
const responseExtractor_1 = require("./responseExtractor");
const parameterExtractor_1 = require("./parameterExtractor");
const typeGenerator_1 = require("./typeGenerator");
const string_1 = require("../../utils/string");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const logger_1 = __importDefault(require("../../utils/logger"));
const paramMapper_1 = require("./paramMapper");
const refResolver_1 = require("./refResolver");
const outputHelper_1 = require("./outputHelper");
const directory_1 = require("../../utils/directory");
/**
 * Processes a single API file.
 */
const handleApiFile = (filePath, outputDir, typesDir, paramsDir) => {
    const apiModel = (0, fileParser_1.parseApiFile)(filePath);
    if (!apiModel)
        return;
    Object.entries(apiModel).forEach(([method, apiDetails]) => {
        try {
            const details = apiDetails;
            if (details.responses) {
                handleApiDetails(details, outputDir, typesDir, paramsDir);
            }
        }
        catch (err) {
            logger_1.default.error(`Error processing API details for method ${method} in file ${filePath}`, err);
        }
    });
};
/**
 * Processes the details of an API method.
 */
const handleApiDetails = (details, outputDir, typesDir, paramsDir) => {
    const successResponseRef = (0, responseExtractor_1.extractSuccessResponseRef)(details.responses || {});
    if (successResponseRef) {
        const paramRefs = (0, parameterExtractor_1.extractParameterRefs)(details.parameters, paramsDir);
        const imports = (0, paramMapper_1.mapParamImports)(paramRefs, paramsDir);
        const paramSignatures = (0, paramMapper_1.mapParamSignatures)(paramRefs);
        const responseType = (0, refResolver_1.resolveResponseType)(successResponseRef);
        const fileName = (0, refResolver_1.resolveFileName)(successResponseRef);
        const outputFolder = (0, outputHelper_1.resolveOutputFolder)(outputDir, details.tags || ['default']);
        (0, directory_1.ensureDirectoryExists)(outputFolder);
        generateTypeFile(details.operationId || 'unknownOperation', paramSignatures, responseType, outputFolder, typesDir, paramsDir, fileName, imports);
    }
};
/**
 * Generates and writes the TypeScript type file.
 */
const generateTypeFile = (operationId, paramSignatures, responseType, outputFolder, typesDir, paramsDir, fileName, imports) => {
    const typeDefinition = (0, typeGenerator_1.generateTypeForSuccessResponse)(operationId, paramSignatures, responseType, outputFolder, typesDir, paramsDir, fileName, imports);
    const outputFileName = `${(0, string_1.toPascalCaseAndRemoveDashes)(operationId)}.ts`;
    const outputFilePath = path.join(outputFolder, outputFileName);
    fs.writeFileSync(outputFilePath, typeDefinition, 'utf8');
    logger_1.default.debug(`Generated type for ${operationId}: \n${typeDefinition}`);
};
/**
 * Entry point to parse API models.
 */
const parseApiModels = (inputDir, outputDir, typesDir, paramsDir) => {
    try {
        const apiFiles = (0, file_1.loadFiles)(inputDir);
        apiFiles.forEach((filePath) => {
            handleApiFile(filePath, outputDir, typesDir, paramsDir);
        });
    }
    catch (err) {
        logger_1.default.error('Error parsing API models', err);
    }
};
exports.parseApiModels = parseApiModels;
