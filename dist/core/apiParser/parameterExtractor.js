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
exports.extractParameterRefs = void 0;
const path = __importStar(require("path"));
const string_1 = require("../../utils/string");
/**
 * Extracts the references for parameters from the API model and converts them into type names.
 *
 * @param parameters - The list of parameter references from the API model.
 * @param parametersDir - The directory where the parameters are located.
 * @returns An array of parameter names and types with the correct import path.
 */
const extractParameterRefs = (parameters, parametersDir) => {
    if (!parameters)
        return [];
    return parameters.map((param) => {
        const paramFileName = param.$ref.split('/').pop()?.replace('.yaml', '') || '';
        const paramType = (0, string_1.toPascalCaseAndRemoveDashes)(paramFileName);
        const paramName = (0, string_1.toCamelCaseFileName)(paramFileName);
        // Detect if parameter is part of a larger file (e.g., Timeoff.ts)
        const importFileName = paramFileName.includes('timeoff')
            ? 'Timeoff'
            : paramType;
        const importPath = path.relative(parametersDir, path.join(parametersDir, `${importFileName}.ts`));
        return { paramName, paramType, importPath };
    });
};
exports.extractParameterRefs = extractParameterRefs;
