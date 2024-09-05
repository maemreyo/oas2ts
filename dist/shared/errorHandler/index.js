"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = void 0;
// src/shared/errorHandler/index.ts
const logger_1 = require("../logger");
function handleError(error) {
    (0, logger_1.logError)(`Error: ${error.message}`);
}
exports.handleError = handleError;
