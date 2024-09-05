"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toPascalCase = exports.toCamelCase = exports.applyPropertyNamingConvention = exports.applyInterfaceNamingConvention = void 0;
// src/shared/namingConvention/index.ts
function applyInterfaceNamingConvention(name) {
    return toPascalCase(name);
}
exports.applyInterfaceNamingConvention = applyInterfaceNamingConvention;
function applyPropertyNamingConvention(name) {
    return toCamelCase(name);
}
exports.applyPropertyNamingConvention = applyPropertyNamingConvention;
function toCamelCase(name) {
    return name.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
}
exports.toCamelCase = toCamelCase;
function toPascalCase(name) {
    return name.replace(/(^\w|-\w)/g, (match) => match.replace('-', '').toUpperCase()); // PascalCase
}
exports.toPascalCase = toPascalCase;
