export interface Config {
  baseDir: string;
  refDirs: string[];
}

export function loadConfig(): Config {
  return {
    baseDir: './project-root',
    refDirs: ['components', 'paths'],
  };
}
