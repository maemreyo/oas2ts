"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSchemaFormat = exports.isReferenceProperty = void 0;
const enums_1 = require("./enums");
/**
 * Type guard to check if a given schema property is a reference property (has a $ref).
 *
 * @param prop - The schema property to check.
 * @returns True if the property has a $ref (is a ReferenceProperty), false otherwise.
 */
const isReferenceProperty = (prop) => {
    return '$ref' in prop;
};
exports.isReferenceProperty = isReferenceProperty;
/**
 * Type guard to check if a given string is a valid SchemaFormats value.
 *
 * @param format - The string to check.
 * @returns True if the string is a valid SchemaFormats value, false otherwise.
 */
const isSchemaFormat = (format) => {
    return Object.values(enums_1.SchemaFormats).includes(format);
};
exports.isSchemaFormat = isSchemaFormat;
