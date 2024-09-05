"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/index.ts
const config_1 = require("./config");
const fileLoader_1 = require("./core/fileLoader");
const refResolver_1 = require("./core/refResolver");
const typeGenerator_1 = require("./core/typeGenerator");
const errorHandler_1 = require("./shared/errorHandler");
const logger_1 = require("./shared/logger");
const cli_1 = require("./cli");
async function processOpenApiFile(openApiFilePath, outputDir) {
    const config = (0, config_1.loadConfig)();
    try {
        const openApiData = await (0, fileLoader_1.loadFile)(openApiFilePath);
        const resolvedOpenApiData = await (0, refResolver_1.resolveRefs)(openApiData, config);
        await (0, typeGenerator_1.generateTypeScriptFiles)(resolvedOpenApiData, outputDir);
        (0, logger_1.logInfo)('Typescript files generated successfully!');
    }
    catch (error) {
        if (error instanceof Error) {
            (0, errorHandler_1.handleError)(error);
        }
        else {
            (0, errorHandler_1.handleError)(new Error(String(error)));
        }
    }
}
const argv = (0, cli_1.parseCLIArgs)();
processOpenApiFile(argv.input, argv.output)
    .then(() => (0, logger_1.logInfo)('Process completed'))
    .catch((error) => {
    if (error instanceof Error) {
        (0, errorHandler_1.handleError)(error);
    }
    else {
        (0, errorHandler_1.handleError)(new Error(String(error)));
    }
});
