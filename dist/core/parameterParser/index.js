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
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapToTypeScriptType = exports.generateParameterType = exports.parseParameterFiles = void 0;
var fileParser_1 = require("./fileParser");
Object.defineProperty(exports, "parseParameterFiles", { enumerable: true, get: function () { return fileParser_1.parseParameterFiles; } });
var typeGenerator_1 = require("./typeGenerator");
Object.defineProperty(exports, "generateParameterType", { enumerable: true, get: function () { return typeGenerator_1.generateParameterType; } });
var typeMapper_1 = require("./typeMapper");
Object.defineProperty(exports, "mapToTypeScriptType", { enumerable: true, get: function () { return typeMapper_1.mapToTypeScriptType; } });
__exportStar(require("./types"), exports);
