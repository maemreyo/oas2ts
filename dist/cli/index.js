"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runCLI = void 0;
const fileLoader_1 = require("../core/fileLoader");
const typeGenerator_1 = require("../core/typeGenerator");
const config_1 = require("../config");
const logger_1 = __importDefault(require("../shared/logger"));
// CLI entry point
const runCLI = () => {
    try {
        const schemas = (0, fileLoader_1.loadFiles)(config_1.config.schemaDirectory);
        (0, typeGenerator_1.generateTypeFiles)(schemas);
        logger_1.default.info('CLI executed successfully');
    }
    catch (error) {
        logger_1.default.error('Error executing CLI', error);
    }
};
exports.runCLI = runCLI;
