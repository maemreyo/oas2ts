"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeTypeName = exports.toPascalCase = exports.generateTypeName = void 0;
// src/infrastructure/typeNameHandler/index.ts
function generateTypeName(schemaName) {
    return toPascalCase(schemaName);
}
exports.generateTypeName = generateTypeName;
function toPascalCase(name) {
    return name.replace(/(^\w|-\w)/g, (match) => match.replace('-', '').toUpperCase()); // PascalCase
}
exports.toPascalCase = toPascalCase;
function sanitizeTypeName(typeName) {
    return typeName.replace(/[^a-zA-Z0-9]/g, ''); // Xóa ký tự không hợp lệ
}
exports.sanitizeTypeName = sanitizeTypeName;
