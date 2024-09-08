"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapParamSignatures = exports.mapParamImports = void 0;
/**
 * Maps parameter import statements.
 */
const mapParamImports = (paramRefs, paramsDir) => {
    return paramRefs.map(({ paramName, paramType, importPath }) => ({
        paramName,
        paramType,
        importPath: importPath.replace(/\\/g, '/').replace('.ts', ''),
    }));
};
exports.mapParamImports = mapParamImports;
/**
 * Maps parameter signatures.
 */
const mapParamSignatures = (paramRefs) => {
    return paramRefs.map(({ paramName, paramType }) => `${paramName}: ${paramType}`);
};
exports.mapParamSignatures = mapParamSignatures;
