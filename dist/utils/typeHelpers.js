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
exports.findTypeInDirectory = exports.generateObjectType = exports.generateArrayType = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
/**
 * Generates a TypeScript array type.
 *
 * @param itemType - The type of the items in the array.
 * @returns The formatted TypeScript array type as a string.
 *
 * @example
 * generateArrayType('string');
 * // Returns: "string[]"
 */
const generateArrayType = (itemType) => {
    return `${itemType}[]`;
};
exports.generateArrayType = generateArrayType;
/**
 * Generates a TypeScript object type from a list of properties.
 *
 * @param properties - An array of strings representing the properties of the object.
 * @returns A TypeScript object type as a string.
 *
 * @example
 * ```typescript
 * const properties = ['id: string', 'name: string'];
 * const objectType = generateObjectType(properties);
 * // Result: '{ id: string; name: string }'
 * ```
 */
const generateObjectType = (properties) => {
    return `{ ${properties.join('; ')} }`;
};
exports.generateObjectType = generateObjectType;
/**
 * Utility function to search for a TypeScript type in a directory and return file details.
 *
 * This function recursively searches through all files in a directory (including nested folders),
 * looking for a TypeScript type definition that matches the provided typeName. If found, it returns
 * an object containing detailed information about the file. If not found, it returns null.
 *
 * @param inputDir - The directory to search in.
 * @param typeName - The TypeScript type name to search for.
 * @returns An object with file details if the type is found, or null if not found.
 */
const findTypeInDirectory = (inputDir, typeName) => {
    const files = fs.readdirSync(inputDir);
    // Iterate through all files and directories in the given directory
    for (const file of files) {
        const filePath = path.join(inputDir, file);
        const fileStat = fs.statSync(filePath);
        // If it's a directory, recursively search inside it
        if (fileStat.isDirectory()) {
            const result = (0, exports.findTypeInDirectory)(filePath, typeName);
            if (result)
                return result;
        }
        // If it's a file, check if it contains the type definition
        else if (fileStat.isFile() && file.endsWith('.ts')) {
            const fileContent = fs.readFileSync(filePath, 'utf-8');
            // Search for the type definition (e.g., `export type typeName = ...`)
            const typeDefinitionRegex = new RegExp(`export\\s+type\\s+${typeName}\\s*=`);
            if (typeDefinitionRegex.test(fileContent)) {
                // Return an object containing detailed information about the file
                return {
                    fileName: path.basename(filePath),
                    filePath: filePath,
                    fileSize: fileStat.size,
                    lastModified: fileStat.mtime,
                };
            }
        }
    }
    // If the type is not found, return null
    return null;
};
exports.findTypeInDirectory = findTypeInDirectory;
