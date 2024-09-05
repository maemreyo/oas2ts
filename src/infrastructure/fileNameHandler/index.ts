import * as path from 'path';
import * as fs from 'fs-extra';

export async function findRefFile(
  ref: string,
  config: { baseDir: string; refDirs: string[] },
): Promise<string | null> {
  const [file] = ref.split('#');

  for (const dir of config.refDirs) {
    const fullPath = path.resolve(config.baseDir, dir, file);
    if (await fs.pathExists(fullPath)) {
      return fullPath;
    }
  }

  return null;
}

export function generateOutputFileName(schemaName: string): string {
  return `${schemaName}.ts`;
}

export function sanitizeFileName(fileName: string): string {
  return fileName.replace(/[^a-zA-Z0-9-_]/g, '');
}
