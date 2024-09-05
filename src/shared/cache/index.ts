// src/shared/cache/index.ts
const cache: Record<string, any> = {};

export function cacheFile(filePath: string, content: any) {
  cache[filePath] = content;
}

export function getCachedFile(filePath: string): any | null {
  return cache[filePath] || null;
}
