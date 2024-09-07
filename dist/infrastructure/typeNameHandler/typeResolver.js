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
exports.resolveRefType = exports.resolveType = void 0;
const path = __importStar(require("path"));
const configLoader_1 = require("../../shared/configLoader");
const string_1 = require("../../utils/string");
const typeGuard_1 = require("../../utils/typeGuard");
const constants_1 = require("../../utils/constants");
const importHelpers_1 = require("../../utils/importHelpers");
const typeHelpers_1 = require("../../utils/typeHelpers");
const enums_1 = require("../../utils/enums");
/**
 * Loads the configuration dynamically from JSON or YAML.
 *
 * @returns The loaded configuration object.
 */
const getConfig = () => {
    return (0, configLoader_1.loadConfig)(path.resolve(process.cwd(), 'oas2ts.config.json'));
};
/**
 * Resolves the TypeScript type for a given schema property.
 * This function handles `$ref`, base types from config, known formats, and basic types.
 *
 * @param prop - The schema property to resolve the type for.
 * @param propName - The name of the property being processed (used to check against config base types).
 * @param imports - A set used to collect import statements for referenced types.
 * @returns The resolved TypeScript type as a string.
 */
const resolveType = (prop, propName, imports) => {
    try {
        // Load config dynamically when resolveType is used
        const config = getConfig();
        // Handle $ref (external references)
        if ('$ref' in prop) {
            return (0, exports.resolveRefType)(prop, imports);
        }
        // Handle baseType from config (UUID, ISODate, etc.)
        const baseType = resolveBaseType(prop, propName, imports, config);
        if (baseType)
            return baseType;
        // Handle known number formats (float, double)
        if (prop.type === enums_1.SchemaTypes.NUMBER) {
            return resolveNumberFormat(prop);
        }
        // Handle basic types (string, integer, boolean, array)
        return resolveBasicTypes(prop, propName, imports);
    }
    catch (error) {
        console.error(`Error resolving type for property ${propName}`, error);
        throw error;
    }
};
exports.resolveType = resolveType;
/**
 * Resolves the type for `$ref` (references to other schemas).
 *
 * @param prop - The schema property containing the `$ref`.
 * @param imports - A set used to collect import statements for referenced types.
 * @returns The resolved TypeScript type from `$ref` or DEFAULT_TYPE if not found.
 */
const resolveRefType = (prop, imports) => {
    if ((0, typeGuard_1.isReferenceProperty)(prop)) {
        const refParts = prop.$ref.split('#');
        const filePath = refParts[0]; // Path to the file with the definition
        const refType = refParts[1] ? refParts[1].replace('/', '') : '';
        if (filePath) {
            const importFileName = (0, string_1.toCamelCase)(path.basename(filePath, path.extname(filePath)));
            const typeName = refType || (0, string_1.capitalize)(importFileName);
            const importPath = `./${importFileName}`;
            // Add the import statement to avoid duplicates
            imports.add(`import { ${typeName} } from '${importPath}';`);
            return typeName;
        }
        return refType || constants_1.DEFAULT_TYPE;
    }
    return constants_1.DEFAULT_TYPE;
};
exports.resolveRefType = resolveRefType;
/**
 * Resolves base types from the config (e.g., UUID, ISODate).
 *
 * @param prop - The schema property to resolve the base type for.
 * @param propName - The name of the property being processed.
 * @param imports - A set used to collect import statements for referenced types.
 * @param config - The loaded configuration object.
 * @returns The resolved base type or undefined if no match is found.
 */
const resolveBaseType = (prop, propName, imports, config) => {
    for (const [baseType, condition] of Object.entries(config.baseType)) {
        if (prop.type === condition.type && // Ensure prop.type exists and matches
            prop.format === condition.format && // Ensure prop.format exists and matches
            condition.props?.some(
            // Check if props is defined
            (p) => propName.toLowerCase().includes(p.toLowerCase()))) {
            imports.add((0, importHelpers_1.generateImportStatement)(baseType, constants_1.BASE_IMPORT_PATH));
            return baseType;
        }
    }
    return undefined;
};
/**
 * Resolves known number formats (e.g., float, double).
 *
 * @param prop - The schema property to resolve the number format for.
 * @returns The TypeScript type for the number format (e.g., 'number').
 */
const resolveNumberFormat = (prop) => {
    if ((0, typeGuard_1.isSchemaFormat)(prop.format ?? '') &&
        [enums_1.SchemaFormats.FLOAT, enums_1.SchemaFormats.DOUBLE].includes(prop.format)) {
        return enums_1.SchemaTypes.NUMBER;
    }
    return enums_1.SchemaTypes.NUMBER;
};
/**
 * Resolves object types by iterating over the properties of the object.
 *
 * @param prop - The schema property representing an object.
 * @param imports - A set used to collect import statements for referenced types.
 * @returns The TypeScript type for the object.
 */
const resolveObjectType = (prop, imports) => {
    const properties = Object.keys(prop.properties).map((propName) => {
        const property = prop.properties[propName];
        const type = (0, exports.resolveType)(property, propName, imports);
        const required = prop.required?.includes(propName) ? '' : '?'; // Handle optional properties
        return `${propName}${required}: ${type}`;
    });
    return (0, typeHelpers_1.generateObjectType)(properties);
};
/**
 * Resolves basic types (string, integer, boolean, array).
 *
 * @param prop - The schema property to resolve the type for.
 * @param propName - The name of the property being processed (used for arrays).
 * @param imports - A set used to collect import statements for referenced types.
 * @returns The TypeScript type for the basic type (e.g., string, number).
 */
const resolveBasicTypes = (prop, propName, imports) => {
    switch (prop.type) {
        case enums_1.SchemaTypes.STRING:
            return enums_1.SchemaTypes.STRING;
        case enums_1.SchemaTypes.INTEGER:
            return enums_1.SchemaTypes.NUMBER;
        case enums_1.SchemaTypes.BOOLEAN:
            return enums_1.SchemaTypes.BOOLEAN;
        case enums_1.SchemaTypes.ARRAY:
            const itemType = (0, exports.resolveType)(prop.items, propName, imports);
            return (0, typeHelpers_1.generateArrayType)(itemType);
        default:
            return constants_1.DEFAULT_TYPE;
    }
};
