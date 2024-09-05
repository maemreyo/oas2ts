import * as path from 'path';
import * as fs from 'fs-extra';
import * as yaml from 'yaml';
import logger from '../../shared/logger';

/**
 * Recursively searches for a file in the given directory.
 * Only returns the path if the file exists.
 */
async function findFileRecursive(
  dir: string,
  file: string,
): Promise<string | null> {
  const files = await fs.readdir(dir); // Read directory contents

  for (const currentFile of files) {
    const currentPath = path.join(dir, currentFile);
    const stat = await fs.stat(currentPath);

    if (stat.isDirectory()) {
      // Recursively search in subdirectories
      const found = await findFileRecursive(currentPath, file);
      if (found) return found;
    } else if (stat.isFile() && currentFile === file) {
      // If file is found, return the full path
      return currentPath;
    }
  }

  return null; // If file is not found, return null
}

/**
 * Finds the referenced file by searching in the root directory or in specified refDirs.
 * Handles fragments (e.g., #/ApprovalAction) if present.
 * Returns null if the file is not found.
 */
export async function findRefFile(
  ref: string,
  config: { baseDir: string; refDirs: string[] },
): Promise<string | null> {
  try {
    const [filePath, fragment] = ref.split('#'); // Split file and fragment (if present)
    const file = path.basename(filePath); // Get the file name from the ref
    const dirPath = path.dirname(filePath); // Get the directory path from the ref
    logger.info({
      filePath,
      fragment,
      file,
      dirPath,
    });

    // Try searching directly in the root directory (baseDir + dirPath)
    const rootFullPath = path.resolve(config.baseDir, dirPath);
    logger.info({ rootFullPath, base: config.baseDir, dirPath });

    if (await fs.pathExists(rootFullPath)) {
      const foundFile = await findFileRecursive(rootFullPath, file);
      logger.info({ foundFile });
      if (foundFile) {
        return foundFile; // Only return the file path if found
      }
    }

    // If not found, fall back to searching in the refDirs
    for (const dir of config.refDirs) {
      const fullPath = path.resolve(config.baseDir, dir, dirPath); // Build full path
      if (await fs.pathExists(fullPath)) {
        const foundFile = await findFileRecursive(fullPath, file);
        if (foundFile) {
          return foundFile; // Only return the file path if found
        }
      }
    }

    logger.warn('File not found for $ref', { ref });
    return null; // Return null if the file was not found
  } catch (error) {
    // Enhanced error logging
    logger.error('Error resolving ref', {
      ref,
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : error,
      details: error,
    });
    return null; // Return null in case of any error
  }
}

export function generateOutputFileName(schemaName: string): string {
  return `${schemaName}.ts`;
}

export function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9-_]/g, '');
}
