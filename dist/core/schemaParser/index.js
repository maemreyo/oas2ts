"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleSpecialTypes = exports.parseSchema = void 0;
function parseSchema(schema) {
    return schema;
}
exports.parseSchema = parseSchema;
function handleSpecialTypes(schema) {
    if (schema.enum) {
        return schema.enum.join(' | ');
    }
    if (schema.oneOf) {
        return schema.oneOf.map(handleSpecialTypes).join(' | ');
    }
    return 'any';
}
exports.handleSpecialTypes = handleSpecialTypes;
