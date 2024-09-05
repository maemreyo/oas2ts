"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveRefs = void 0;
const fileLoader_1 = require("../fileLoader");
const fileNameHandler_1 = require("../../infrastructure/fileNameHandler");
async function resolveRefs(data, config) {
    if (typeof data !== 'object' || data === null) {
        return data;
    }
    if (Array.isArray(data)) {
        return Promise.all(data.map((item) => resolveRefs(item, config)));
    }
    if (data.$ref) {
        const refFile = await (0, fileNameHandler_1.findRefFile)(data.$ref, config);
        if (!refFile) {
            throw new Error(`Cannot find referenced file for ${data.$ref}`);
        }
        const refYaml = await (0, fileLoader_1.loadFile)(refFile);
        return resolveRefs(refYaml, config);
    }
    const resolvedObject = {};
    for (const key in data) {
        resolvedObject[key] = await resolveRefs(data[key], config);
    }
    return resolvedObject;
}
exports.resolveRefs = resolveRefs;
