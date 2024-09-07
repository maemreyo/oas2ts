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
const fileLoader_1 = require("../core/fileLoader");
const typeGenerator_1 = require("../core/typeGenerator");
const logger_1 = __importDefault(require("../shared/logger"));
/**
 * Loads JSON configuration from the root directory.
 *
 * @param configPath - The path to the configuration file (JSON or YAML).
 * @returns Parsed configuration object.
 * @throws Will throw an error if the config file cannot be loaded.
 */
const loadJsonConfig = (configPath) => {
    try {
        // Ensure the config file is being read from the root directory if no path is provided
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
        // Load schema files from the specified directory in config
        const schemas = (0, fileLoader_1.loadFiles)(config.schemaDirectory);
        // Generate types for the loaded schema files and output to the directory in config
        (0, typeGenerator_1.generateTypeFiles)(schemas, './oas2ts.config.json');
        logger_1.default.info('CLI executed successfully');
    }
    catch (error) {
        logger_1.default.error('Error executing CLI', error);
    }
};
exports.runCLI = runCLI;
