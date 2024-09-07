"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SchemaFormats = exports.SchemaTypes = void 0;
// Define a TypeScript enum for schema types
var SchemaTypes;
(function (SchemaTypes) {
    SchemaTypes["STRING"] = "string";
    SchemaTypes["NUMBER"] = "number";
    SchemaTypes["BOOLEAN"] = "boolean";
    SchemaTypes["ARRAY"] = "array";
    SchemaTypes["OBJECT"] = "object";
    SchemaTypes["INTEGER"] = "integer";
})(SchemaTypes = exports.SchemaTypes || (exports.SchemaTypes = {}));
// Define an enum for common formats
var SchemaFormats;
(function (SchemaFormats) {
    SchemaFormats["FLOAT"] = "float";
    SchemaFormats["DOUBLE"] = "double";
    SchemaFormats["UUID"] = "uuid";
    SchemaFormats["DATE_TIME"] = "date-time";
})(SchemaFormats = exports.SchemaFormats || (exports.SchemaFormats = {}));
