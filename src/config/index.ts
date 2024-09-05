export interface Config {
  baseDir: string;
  refDirs: string[];
}

export function loadConfig(): Config {
  return {
    baseDir: './mocks/input',
    refDirs: ['components', 'paths', 'headers'],
  };
}
