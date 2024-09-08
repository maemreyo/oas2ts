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
exports.writeToFile = exports.loadFiles = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const logger_1 = __importDefault(require("../../utils/logger"));
/**
 * Loads all files recursively from a directory.
 *
 * @param dirPath - The directory path to load files from.
 * @returns An array of file paths.
 */
const loadFiles = (dirPath) => {
    let fileList = [];
    try {
        const items = fs.readdirSync(dirPath);
        items.forEach((item) => {
            const fullPath = path.join(dirPath, item);
            // Check if the item is a directory or a file
            const stat = fs.statSync(fullPath);
            if (stat.isDirectory()) {
                // Recursively load files from the subdirectory
                fileList = fileList.concat((0, exports.loadFiles)(fullPath));
            }
            else if (stat.isFile()) {
                fileList.push(fullPath);
            }
        });
    }
    catch (error) {
        logger_1.default.error(`Error reading directory: ${dirPath}`, error);
    }
    return fileList;
};
exports.loadFiles = loadFiles;
/**
 * Writes the content to the specified file.
 *
 * @param filePath - The path of the file to write.
 * @param content - The content to be written.
 */
const writeToFile = (filePath, content) => {
    fs.writeFileSync(filePath, content, 'utf8');
};
exports.writeToFile = writeToFile;
