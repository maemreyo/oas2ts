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
exports.getDefaultConfig = exports.loadConfig = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const yaml = __importStar(require("js-yaml"));
/**
 * Loads a configuration file in either JSON or YAML format.
 *
 * @param configPath - The path to the configuration file.
 * @returns The parsed configuration object.
 * @throws Will throw an error if the file format is not supported.
 */
const loadConfig = (configPath) => {
    const ext = path.extname(configPath);
    // Check the format of the configuration file (only supports .json or .yaml)
    if (!['.json', '.yaml', '.yml'].includes(ext)) {
        throw new Error('Unsupported config file format. Use .json or .yaml.');
    }
    // Read the contents of the configuration file
    const configFile = fs.readFileSync(configPath, 'utf8');
    // Parse the file based on its extension (JSON or YAML)
    let config;
    if (ext === '.json') {
        config = JSON.parse(configFile);
    }
    else {
        config = yaml.load(configFile);
    }
    return config;
};
exports.loadConfig = loadConfig;
/**
 * Returns the default configuration if no configuration file is provided.
 *
 * @returns The default configuration object.
 */
const getDefaultConfig = () => ({
    schemaDirectory: './mocks/input/schemas',
    outputDirectory: './mocks/output/types',
    baseType: {
        UUID: {
            type: 'string',
            format: 'uuid',
            props: ['id'],
        },
        ISODate: {
            type: 'string',
            format: 'date-time',
            props: ['at', 'created', 'updated', 'time'],
        },
    },
});
exports.getDefaultConfig = getDefaultConfig;
