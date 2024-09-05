import { loadFile } from '../fileLoader';
import { findRefFile } from '../../infrastructure/fileNameHandler';

export async function resolveRefs(
  data: any,
  config: { baseDir: string; refDirs: string[] },
): Promise<any> {
  if (typeof data !== 'object' || data === null) {
    return data;
  }

  if (Array.isArray(data)) {
    return Promise.all(data.map((item) => resolveRefs(item, config)));
  }

  if (data.$ref) {
    const refFile = await findRefFile(data.$ref, config);
    if (!refFile) {
      throw new Error(`Cannot find referenced file for ${data.$ref}`);
    }

    const refYaml = await loadFile(refFile);
    return resolveRefs(refYaml, config);
  }

  const resolvedObject: any = {};
  for (const key in data) {
    resolvedObject[key] = await resolveRefs(data[key], config);
  }

  return resolvedObject;
}
