import * as fs from 'fs-extra';
import * as yaml from 'yaml';

export async function loadYamlFile(filePath: string): Promise<any> {
  const fileContents = await fs.readFile(filePath, 'utf8');
  return yaml.parse(fileContents);
}

export async function loadJsonFile(filePath: string): Promise<any> {
  const fileContents = await fs.readFile(filePath, 'utf8');
  return JSON.parse(fileContents);
}

export async function loadFile(filePath: string): Promise<any> {
  if (filePath.endsWith('.yaml') || filePath.endsWith('.yml')) {
    return loadYamlFile(filePath);
  } else if (filePath.endsWith('.json')) {
    return loadJsonFile(filePath);
  } else {
    throw new Error(`Unsupported file format for ${filePath}`);
  }
}
