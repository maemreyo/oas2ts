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
exports.readYamlFileContent = exports.readYamlFilesRecursively = exports.parseYamlFile = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const yaml = __importStar(require("js-yaml"));
/**
 * Reads and parses a YAML file to a JSON object.
 *
 * @param filePath - Path to the YAML file
 * @returns Parsed JSON object from YAML
 */
const parseYamlFile = (filePath) => {
    const fileContent = fs.readFileSync(filePath, 'utf8');
    return yaml.load(fileContent);
};
exports.parseYamlFile = parseYamlFile;
/**
 * Recursively reads all YAML files from a directory.
 *
 * @param dirPath - Path to the directory
 * @returns Array of parsed YAML objects
 */
const readYamlFilesRecursively = (dirPath) => {
    let results = [];
    fs.readdirSync(dirPath).forEach((file) => {
        const fullPath = path.join(dirPath, file);
        const stat = fs.lstatSync(fullPath);
        if (stat.isDirectory()) {
            results = results.concat((0, exports.readYamlFilesRecursively)(fullPath));
        }
        else if (fullPath.endsWith('.yaml') || fullPath.endsWith('.yml')) {
            const parsedYaml = (0, exports.parseYamlFile)(fullPath);
            results.push({ filePath: fullPath, data: parsedYaml });
        }
    });
    return results;
};
exports.readYamlFilesRecursively = readYamlFilesRecursively;
/**
 * Reads the content of a YAML file and returns it as a string.
 *
 * @param filePath - The path to the YAML file.
 * @returns The content of the YAML file as a string.
 */
const readYamlFileContent = (filePath) => {
    return fs.readFileSync(filePath, 'utf8');
};
exports.readYamlFileContent = readYamlFileContent;
