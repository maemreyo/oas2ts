import { loadYamlFile } from '../fileLoader';
import { findRefFile } from '../../infrastructure/fileNameHandler';
import logger from '../../shared/logger';

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

  if (data.$ref && typeof data.$ref === 'string') {
    const refPath = sanitizeRef(data.$ref);
    logger.info(`Using sanitized $ref: ${refPath}`);

    const refFile = await findRefFile(refPath, config);

    if (!refFile) {
      logger.warn('Cannot find referenced file', { ref: refPath });
      return null;
    }

    // Đảm bảo rằng refFile là một string và không phải là object đã parse
    if (typeof refFile === 'string') {
      const refYaml = await loadYamlFile(refFile); // Chỉ gọi loadYamlFile nếu refFile là chuỗi
      logger.info('Resolved $ref YAML content', { refYaml });

      return resolveRefs(refYaml, config); // Đệ quy để xử lý các $ref lồng nhau
    }
  }

  const resolvedObject: any = {};
  for (const key in data) {
    resolvedObject[key] = await resolveRefs(data[key], config);
  }

  return resolvedObject;
}

function sanitizeRef(ref: string): string {
  let sanitizedRef = ref;
  while (sanitizedRef.startsWith('"') && sanitizedRef.endsWith('"')) {
    sanitizedRef = sanitizedRef.slice(1, -1);
  }
  return sanitizedRef;
}
