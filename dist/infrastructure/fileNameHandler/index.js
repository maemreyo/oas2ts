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
exports.sanitizeFileName = exports.generateOutputFileName = exports.findRefFile = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
const logger_1 = __importDefault(require("../../shared/logger"));
/**
 * Recursively searches for a file in the given directory.
 * Only returns the path if the file exists.
 */
async function findFileRecursive(dir, file) {
    const files = await fs.readdir(dir); // Read directory contents
    for (const currentFile of files) {
        const currentPath = path.join(dir, currentFile);
        const stat = await fs.stat(currentPath);
        if (stat.isDirectory()) {
            // Recursively search in subdirectories
            const found = await findFileRecursive(currentPath, file);
            if (found)
                return found;
        }
        else if (stat.isFile() && currentFile === file) {
            // If file is found, return the full path
            return currentPath;
        }
    }
    return null; // If file is not found, return null
}
/**
 * Finds the referenced file by searching in the root directory or in specified refDirs.
 * Handles fragments (e.g., #/ApprovalAction) if present.
 * Returns null if the file is not found.
 */
async function findRefFile(ref, config) {
    try {
        const [filePath, fragment] = ref.split('#'); // Split file and fragment (if present)
        const file = path.basename(filePath); // Get the file name from the ref
        const dirPath = path.dirname(filePath); // Get the directory path from the ref
        logger_1.default.info({
            filePath,
            fragment,
            file,
            dirPath,
        });
        // Try searching directly in the root directory (baseDir + dirPath)
        const rootFullPath = path.resolve(config.baseDir, dirPath);
        logger_1.default.info({ rootFullPath, base: config.baseDir, dirPath });
        if (await fs.pathExists(rootFullPath)) {
            const foundFile = await findFileRecursive(rootFullPath, file);
            logger_1.default.info({ foundFile });
            if (foundFile) {
                return foundFile; // Only return the file path if found
            }
        }
        // If not found, fall back to searching in the refDirs
        for (const dir of config.refDirs) {
            const fullPath = path.resolve(config.baseDir, dir, dirPath); // Build full path
            if (await fs.pathExists(fullPath)) {
                const foundFile = await findFileRecursive(fullPath, file);
                if (foundFile) {
                    return foundFile; // Only return the file path if found
                }
            }
        }
        logger_1.default.warn('File not found for $ref', { ref });
        return null; // Return null if the file was not found
    }
    catch (error) {
        // Enhanced error logging
        logger_1.default.error('Error resolving ref', {
            ref,
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : error,
            details: error,
        });
        return null; // Return null in case of any error
    }
}
exports.findRefFile = findRefFile;
function generateOutputFileName(schemaName) {
    return `${schemaName}.ts`;
}
exports.generateOutputFileName = generateOutputFileName;
function sanitizeFileName(fileName) {
    return fileName.replace(/[^a-zA-Z0-9-_]/g, '');
}
exports.sanitizeFileName = sanitizeFileName;
