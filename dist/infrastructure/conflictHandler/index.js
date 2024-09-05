"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveNameConflict = exports.detectNameConflict = void 0;
// src/infrastructure/conflictHandler/index.ts
function detectNameConflict(existingNames, newName) {
    return existingNames.includes(newName);
}
exports.detectNameConflict = detectNameConflict;
function resolveNameConflict(existingNames, newName) {
    let counter = 1;
    let resolvedName = newName;
    while (existingNames.includes(resolvedName)) {
        resolvedName = `${newName}${counter}`;
        counter++;
    }
    return resolvedName;
}
exports.resolveNameConflict = resolveNameConflict;
