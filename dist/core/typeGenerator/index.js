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
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTypeScriptFiles = exports.generateTypeScriptInterface = void 0;
// @ts-nocheck
const path = __importStar(require("path"));
const fs = __importStar(require("fs-extra"));
const js_yaml_1 = __importDefault(require("js-yaml"));
const namingConvention_1 = require("../../shared/namingConvention");
const fileNameHandler_1 = require("../../infrastructure/fileNameHandler");
const schemaParser_1 = require("../schemaParser");
const logger_1 = __importDefault(require("../../shared/logger"));
const refResolver_1 = require("../refResolver");
function generateTypeScriptInterface(schemaName, properties) {
    logger_1.default.info('Generating TypeScript interface...', { schemaName });
    const lines = Object.keys(properties).map((propName) => {
        const prop = properties[propName];
        const tsType = (0, schemaParser_1.handleSpecialTypes)(prop) || 'any';
        const requiredFlag = prop.required ? '' : '?';
        logger_1.default.info('Processed property for interface', {
            propName,
            tsType,
            requiredFlag,
        });
        return `  ${(0, namingConvention_1.applyPropertyNamingConvention)(propName)}${requiredFlag}: ${tsType};`;
    });
    const interfaceName = (0, namingConvention_1.applyInterfaceNamingConvention)(schemaName);
    logger_1.default.info('Generated interface name:', { interfaceName });
    return `export interface ${interfaceName} {\n${lines.join('\n')}\n}`;
}
exports.generateTypeScriptInterface = generateTypeScriptInterface;
async function generateTypeScriptFiles(resolvedData, outputDir) {
    logger_1.default.info('Starting to process resolved data...');
    // Kiểm tra nếu resolvedData là chuỗi JSON hoặc YAML
    if (typeof resolvedData === 'string') {
        logger_1.default.info('Resolved data is a string, attempting to parse as JSON or YAML');
        try {
            // Thử parse nếu là JSON
            resolvedData = JSON.parse(resolvedData);
            logger_1.default.info('Resolved data parsed as JSON:', { resolvedData });
        }
        catch (jsonError) {
            logger_1.default.warn('Failed to parse as JSON, trying YAML', { jsonError });
            try {
                // Nếu không thành công, thử parse như YAML
                resolvedData = js_yaml_1.default.load(resolvedData);
                logger_1.default.info('Resolved data parsed as YAML:', { resolvedData });
            }
            catch (yamlError) {
                logger_1.default.error('Failed to parse resolvedData as JSON or YAML', {
                    jsonError,
                    yamlError,
                });
                return; // Thoát nếu không parse được
            }
        }
    }
    else {
        logger_1.default.info('Resolved data is not a string, continuing with object data...');
    }
    // Xử lý components schemas
    if (resolvedData.components && resolvedData.components.schemas) {
        logger_1.default.info('Found schemas in components:', {
            schemas: resolvedData.components.schemas,
        });
        for (const schemaName in resolvedData.components.schemas) {
            const schema = resolvedData.components.schemas[schemaName];
            const properties = schema.properties || {};
            logger_1.default.info(`Processing schema: ${schemaName}`, { properties });
            const tsInterface = generateTypeScriptInterface(schemaName, properties);
            logger_1.default.info({ tsInterface });
            const outputFilePath = path.join(outputDir, (0, fileNameHandler_1.generateOutputFileName)(schemaName));
            try {
                await fs.writeFile(outputFilePath, tsInterface, 'utf8');
                logger_1.default.info('Generated TypeScript interface', {
                    schemaName,
                    outputFilePath,
                });
            }
            catch (writeError) {
                logger_1.default.error('Error writing TypeScript file', {
                    schemaName,
                    outputFilePath,
                    error: writeError,
                });
            }
        }
    }
    else {
        logger_1.default.warn('No schemas found in components.');
    }
    // Xử lý các path refs
    if (resolvedData.paths) {
        logger_1.default.info('Found paths in OpenAPI:', { paths: resolvedData.paths });
        for (const pathName in resolvedData.paths) {
            logger_1.default.info(`Processing path: ${pathName}`);
            const pathData = resolvedData.paths[pathName];
            const resolvedPathData = await (0, refResolver_1.resolveRefs)(pathData, {
                baseDir: outputDir,
                refDirs: ['paths', 'components'],
            });
            logger_1.default.info(`Processed path: ${pathName}`, { resolvedPathData });
            logger_1.default.info('REQUESTBODY??', !!resolvedPathData &&
                !!resolvedPathData.requestBody &&
                !!resolvedPathData.requestBody.content);
            // Xử lý requestBody nếu có
            if (
            // resolvedPathData &&
            // resolvedPathData.requestBody &&
            // resolvedPathData.requestBody.content
            true) {
                for (const contentType in resolvedPathData.requestBody.content) {
                    logger_1.default.info({ contentType });
                    const contentSchema = resolvedPathData.requestBody.content[contentType].schema;
                    logger_1.default.info({ contentSchema });
                    if (contentSchema && contentSchema.properties) {
                        const interfaceName = `${pathName.replace(/[\/{}]/g, '_')}RequestBody`;
                        logger_1.default.info({ interfaceName });
                        const tsInterface = generateTypeScriptInterface(interfaceName, contentSchema.properties);
                        logger_1.default.info({ tsInterface });
                        const outputFilePath = path.join(outputDir, (0, fileNameHandler_1.generateOutputFileName)(interfaceName));
                        logger_1.default.info(`Attempting to write requestBody interface for path: ${pathName}`, { interfaceName, outputFilePath });
                        try {
                            await fs.writeFile(outputFilePath, tsInterface, 'utf8');
                            logger_1.default.info('Generated TypeScript interface for requestBody', {
                                interfaceName,
                                outputFilePath,
                            });
                        }
                        catch (writeError) {
                            logger_1.default.error('Error writing TypeScript file for requestBody', {
                                interfaceName,
                                outputFilePath,
                                error: writeError,
                            });
                        }
                    }
                }
            }
            // Xử lý responses nếu có
            if (resolvedPathData && resolvedPathData.responses) {
                logger_1.default.info('Found responses for the path', { pathName });
                for (const statusCode in resolvedPathData.responses) {
                    const responseSchema = resolvedPathData.responses[statusCode].content?.['application/json']
                        ?.schema;
                    if (responseSchema && responseSchema.properties) {
                        const interfaceName = `${pathName.replace(/[\/{}]/g, '_')}_Response_${statusCode}`;
                        const tsInterface = generateTypeScriptInterface(interfaceName, responseSchema.properties);
                        const outputFilePath = path.join(outputDir, (0, fileNameHandler_1.generateOutputFileName)(interfaceName));
                        logger_1.default.info(`Attempting to write response interface for path: ${pathName}, status code: ${statusCode}`, { interfaceName, outputFilePath });
                        try {
                            await fs.writeFile(outputFilePath, tsInterface, 'utf8');
                            logger_1.default.info('Generated TypeScript interface for response', {
                                interfaceName,
                                outputFilePath,
                            });
                        }
                        catch (writeError) {
                            logger_1.default.error('Error writing TypeScript file for response', {
                                interfaceName,
                                outputFilePath,
                                error: writeError,
                            });
                        }
                    }
                }
            }
            else {
                logger_1.default.info('No responses found for the path', { pathName });
            }
            // Xử lý parameters nếu có
            if (resolvedPathData && resolvedPathData.parameters) {
                logger_1.default.info('Found parameters for the path', { pathName });
                const paramsInterfaceName = `${pathName.replace(/[\/{}]/g, '_')}Parameters`;
                const paramsProperties = {};
                resolvedPathData.parameters.forEach((param) => {
                    if (param.schema) {
                        paramsProperties[param.name] = param.schema;
                    }
                });
                if (Object.keys(paramsProperties).length > 0) {
                    const tsInterface = generateTypeScriptInterface(paramsInterfaceName, paramsProperties);
                    const outputFilePath = path.join(outputDir, (0, fileNameHandler_1.generateOutputFileName)(paramsInterfaceName));
                    logger_1.default.info(`Attempting to write parameters interface for path: ${pathName}`, { paramsInterfaceName, outputFilePath });
                    try {
                        await fs.writeFile(outputFilePath, tsInterface, 'utf8');
                        logger_1.default.info('Generated TypeScript interface for parameters', {
                            paramsInterfaceName,
                            outputFilePath,
                        });
                    }
                    catch (writeError) {
                        logger_1.default.error('Error writing TypeScript file for parameters', {
                            paramsInterfaceName,
                            outputFilePath,
                            error: writeError,
                        });
                    }
                }
            }
            else {
                logger_1.default.info('No parameters found for the path', { pathName });
            }
        }
    }
    else {
        logger_1.default.warn('No paths found in OpenAPI specification.');
    }
}
exports.generateTypeScriptFiles = generateTypeScriptFiles;
