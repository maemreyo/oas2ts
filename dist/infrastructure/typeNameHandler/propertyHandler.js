"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateProperties = void 0;
const typeResolver_1 = require("./typeResolver");
const string_1 = require("../../utils/string");
const generateProperties = (properties, required, indentLevel, imports) => {
    return Object.keys(properties)
        .map((propName) => {
        const prop = properties[propName];
        const isRequired = required.includes(propName);
        const camelCasePropName = (0, string_1.toCamelCase)(propName);
        const type = (0, typeResolver_1.resolveType)(prop, propName, imports);
        return `${(0, string_1.indentString)(`${camelCasePropName}${isRequired ? '' : '?'}: ${type};`, indentLevel)}`;
    })
        .join('\n');
};
exports.generateProperties = generateProperties;
