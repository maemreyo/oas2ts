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
exports.generateTypeScriptFiles = exports.generateTypeScriptInterface = void 0;
const namingConvention_1 = require("../../shared/namingConvention");
const fileNameHandler_1 = require("../../infrastructure/fileNameHandler");
const schemaParser_1 = require("../schemaParser");
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
function generateTypeScriptInterface(schemaName, properties) {
    const lines = Object.keys(properties).map((propName) => {
        const prop = properties[propName];
        const tsType = (0, schemaParser_1.handleSpecialTypes)(prop) || 'any';
        const requiredFlag = prop.required ? '' : '?';
        return `  ${(0, namingConvention_1.applyPropertyNamingConvention)(propName)}${requiredFlag}: ${tsType};`;
    });
    const interfaceName = (0, namingConvention_1.applyInterfaceNamingConvention)(schemaName);
    return `export interface ${interfaceName} {\n${lines.join('\n')}\n}`;
}
exports.generateTypeScriptInterface = generateTypeScriptInterface;
async function generateTypeScriptFiles(resolvedData, outputDir) {
    if (resolvedData.components && resolvedData.components.schemas) {
        for (const schemaName in resolvedData.components.schemas) {
            const schema = resolvedData.components.schemas[schemaName];
            const properties = schema.properties || {};
            const tsInterface = generateTypeScriptInterface(schemaName, properties);
            const outputFilePath = path.join(outputDir, (0, fileNameHandler_1.generateOutputFileName)(schemaName));
            await fs.writeFile(outputFilePath, tsInterface, 'utf8');
        }
    }
}
exports.generateTypeScriptFiles = generateTypeScriptFiles;
