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
exports.loadFile = exports.loadJsonFile = exports.loadYamlFile = void 0;
const fs = __importStar(require("fs-extra"));
const yaml = __importStar(require("yaml"));
async function loadYamlFile(filePath) {
    const fileContents = await fs.readFile(filePath, 'utf8');
    return yaml.parse(fileContents);
}
exports.loadYamlFile = loadYamlFile;
async function loadJsonFile(filePath) {
    const fileContents = await fs.readFile(filePath, 'utf8');
    return JSON.parse(fileContents);
}
exports.loadJsonFile = loadJsonFile;
async function loadFile(filePath) {
    if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) {
        return loadYamlFile(filePath);
    }
    else if (filePath.endsWith('.json')) {
        return loadJsonFile(filePath);
    }
    else {
        throw new Error(`Unsupported file format for ${filePath}`);
    }
}
exports.loadFile = loadFile;
