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
exports.parseApiFile = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const yaml = __importStar(require("js-yaml"));
const logger_1 = __importDefault(require("../../utils/logger"));
/**
 * Parses an API model file (YAML or JSON).
 *
 * @param filePath - The path to the API model file.
 * @returns Parsed content of the file as an object.
 */
const parseApiFile = (filePath) => {
    try {
        const ext = path.extname(filePath).toLowerCase();
        const fileContent = fs.readFileSync(filePath, 'utf8');
        // logger.info({ fileContent });
        if (ext === '.yaml' || ext === '.yml') {
            return yaml.load(fileContent);
        }
        else if (ext === '.json') {
            return JSON.parse(fileContent);
        }
        else {
            throw new Error(`Unsupported file format: ${ext}`);
        }
    }
    catch (error) {
        logger_1.default.error(`Error reading API model file: ${filePath}`, error);
        return null;
    }
};
exports.parseApiFile = parseApiFile;
