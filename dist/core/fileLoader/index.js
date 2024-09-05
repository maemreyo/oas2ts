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
exports.loadJsonFile = exports.loadYamlFile = void 0;
// @ts-nocheck
const fs = __importStar(require("fs-extra"));
const logger_1 = __importDefault(require("../../shared/logger"));
const js_yaml_1 = __importDefault(require("js-yaml"));
async function loadYamlFile(filePath) {
    try {
        const fileContents = await fs.readFile(filePath, 'utf8');
        const parsedYaml = js_yaml_1.default.load(fileContents);
        // Log all $ref to check for unwanted quotes
        if (parsedYaml && typeof parsedYaml === 'object') {
            Object.keys(parsedYaml).forEach((key) => {
                if (parsedYaml[key]?.$ref) {
                    logger_1.default.info(`Parsed $ref: ${parsedYaml[key].$ref}`);
                }
            });
        }
        return parsedYaml;
    }
    catch (error) {
        logger_1.default.error('Failed to load YAML file', { filePath, error });
        throw error;
    }
}
exports.loadYamlFile = loadYamlFile;
async function loadJsonFile(filePath) {
    try {
        const fileContents = await fs.readFile(filePath, 'utf8');
        return JSON.parse(fileContents);
    }
    catch (error) {
        logger_1.default.error('Failed to load JSON file', { filePath, error });
        throw error;
    }
}
exports.loadJsonFile = loadJsonFile;
