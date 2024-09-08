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
exports.runCLI = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const logger_1 = __importDefault(require("../utils/logger"));
const typeGenerator_1 = require("../core/typeGenerator");
const apiParser_1 = require("../core/apiParser");
const parameterParser_1 = require("../core/parameterParser");
const file_1 = require("../core/file");
/**
 * Loads JSON configuration from the root directory.
 *
 * @param configPath - The path to the configuration file (JSON or YAML).
 * @returns Parsed configuration object.
 * @throws Will throw an error if the config file cannot be loaded.
 */
const loadJsonConfig = (configPath) => {
    try {
        const resolvedConfigPath = configPath
            ? path.resolve(process.cwd(), configPath)
            : path.resolve(process.cwd(), 'oas2ts.config.json');
        const configFile = fs.readFileSync(resolvedConfigPath, 'utf8');
        return JSON.parse(configFile);
    }
    catch (error) {
        logger_1.default.error('Error loading config file', error);
        throw new Error('Failed to load configuration');
    }
};
/**
 * CLI entry point
 */
const runCLI = () => {
    try {
        // Load configuration from JSON in root directory or specified path
        const config = loadJsonConfig();
        const schemasDir = config.directories.input.schemas;
        const apiModelDir = config.directories.input.apiModels;
        const apiOutputDir = config.directories.output.apiModels;
        const typesDir = config.directories.output.types;
        const parameterInputDir = config.directories.input.parameters; // New input directory for parameters
        const parameterOutputDir = config.directories.output.parameters; // New output directory for parameters
        // Step 1: Generate types for parameters
        logger_1.default.info('Generating types for parameters...');
        (0, parameterParser_1.parseParameterFiles)(parameterInputDir, parameterOutputDir);
        logger_1.default.info('Parameter types generated successfully');
        // Step 2: Generate types for schemas
        logger_1.default.info('Generating types for schemas...');
        const schemas = (0, file_1.loadFiles)(schemasDir);
        (0, typeGenerator_1.generateTypeFiles)(schemas, './oas2ts.config.json');
        logger_1.default.info('Schema types generated successfully');
        // Step 3: Load API model files and generate corresponding types
        logger_1.default.info('Loading API model files...');
        (0, apiParser_1.parseApiModels)(apiModelDir, apiOutputDir, typesDir, parameterOutputDir);
        logger_1.default.info('API models parsed and types generated successfully');
    }
    catch (error) {
        logger_1.default.error('Error executing CLI', error);
    }
};
exports.runCLI = runCLI;
