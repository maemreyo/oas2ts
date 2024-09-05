"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveRefs = void 0;
const fileLoader_1 = require("../fileLoader");
const fileNameHandler_1 = require("../../infrastructure/fileNameHandler");
const logger_1 = __importDefault(require("../../shared/logger"));
async function resolveRefs(data, config) {
    if (typeof data !== 'object' || data === null) {
        return data;
    }
    if (Array.isArray(data)) {
        return Promise.all(data.map((item) => resolveRefs(item, config)));
    }
    if (data.$ref && typeof data.$ref === 'string') {
        const refPath = sanitizeRef(data.$ref);
        logger_1.default.info(`Using sanitized $ref: ${refPath}`);
        const refFile = await (0, fileNameHandler_1.findRefFile)(refPath, config);
        if (!refFile) {
            logger_1.default.warn('Cannot find referenced file', { ref: refPath });
            return null;
        }
        // Đảm bảo rằng refFile là một string và không phải là object đã parse
        if (typeof refFile === 'string') {
            const refYaml = await (0, fileLoader_1.loadYamlFile)(refFile); // Chỉ gọi loadYamlFile nếu refFile là chuỗi
            logger_1.default.info('Resolved $ref YAML content', { refYaml });
            return resolveRefs(refYaml, config); // Đệ quy để xử lý các $ref lồng nhau
        }
    }
    const resolvedObject = {};
    for (const key in data) {
        resolvedObject[key] = await resolveRefs(data[key], config);
    }
    return resolvedObject;
}
exports.resolveRefs = resolveRefs;
function sanitizeRef(ref) {
    let sanitizedRef = ref;
    while (sanitizedRef.startsWith('"') && sanitizedRef.endsWith('"')) {
        sanitizedRef = sanitizedRef.slice(1, -1);
    }
    return sanitizedRef;
}
