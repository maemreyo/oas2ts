"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateProperties = void 0;
const typeResolver_1 = require("./typeResolver");
const string_1 = require("../../utils/string");
const logger_1 = __importDefault(require("../../utils/logger"));
const generateProperties = (properties, required, indentLevel, imports) => {
    try {
        logger_1.default.debug(`Generating properties for object with ${Object.keys(properties).length} properties`);
        return Object.keys(properties)
            .map((propName) => {
            const prop = properties[propName];
            const isRequired = required.includes(propName);
            const camelCasePropName = (0, string_1.toCamelCase)(propName);
            const type = (0, typeResolver_1.resolveType)(prop, propName, imports);
            return `${' '.repeat(indentLevel)}${camelCasePropName}${isRequired ? '' : '?'}: ${type};`;
        })
            .join('\n');
    }
    catch (error) {
        console.error('Error generating properties', error);
        throw error;
    }
};
exports.generateProperties = generateProperties;
