/**
 * Maps parameter import statements.
 */
export const mapParamImports = (
  paramRefs: { paramName: string; paramType: string; importPath: string }[],
  paramsDir: string,
) => {
  return paramRefs.map(({ paramName, paramType, importPath }) => ({
    paramName,
    paramType,
    importPath: importPath.replace(/\\/g, '/').replace('.ts', ''),
  }));
};

/**
 * Maps parameter signatures.
 */
export const mapParamSignatures = (
  paramRefs: { paramName: string; paramType: string }[],
) => {
  return paramRefs.map(
    ({ paramName, paramType }) => `${paramName}: ${paramType}`,
  );
};
