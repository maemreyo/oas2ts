"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const config_1 = require("./config");
const refResolver_1 = require("./core/refResolver");
const typeGenerator_1 = require("./core/typeGenerator");
const logger_1 = __importDefault(require("./shared/logger"));
const cli_1 = require("./cli");
const fileLoader_1 = require("./core/fileLoader");
async function processOpenApiFile(openApiFilePath, outputDir) {
    const config = (0, config_1.loadConfig)();
    try {
        const openApiData = await (0, fileLoader_1.loadYamlFile)(openApiFilePath);
        const resolvedOpenApiData = await (0, refResolver_1.resolveRefs)(openApiData, config);
        await (0, typeGenerator_1.generateTypeScriptFiles)(resolvedOpenApiData, outputDir);
        logger_1.default.info('Typescript files generated successfully!');
    }
    catch (error) {
        if (error instanceof Error) {
            logger_1.default.error(error);
        }
        else {
            logger_1.default.error(new Error(String(error)));
        }
    }
}
// Get CLI arguments
const argv = (0, cli_1.parseCLIArgs)();
processOpenApiFile(argv.input, argv.output)
    .then(() => logger_1.default.info('Process completed'))
    .catch((error) => {
    if (error instanceof Error) {
        logger_1.default.error(error);
    }
    else {
        logger_1.default.error(new Error(String(error)));
    }
});
