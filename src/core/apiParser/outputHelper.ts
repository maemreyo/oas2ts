import * as path from 'path';

/**
 * Resolves the output folder path based on tags.
 */
export const resolveOutputFolder = (
  outputDir: string,
  tags: string[],
): string => {
  return path.join(outputDir, ...tags);
};
