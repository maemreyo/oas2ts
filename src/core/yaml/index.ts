import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';

/**
 * Reads and parses a YAML file to a JSON object.
 *
 * @param filePath - Path to the YAML file
 * @returns Parsed JSON object from YAML
 */
export const parseYamlFile = (filePath: string): any => {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return yaml.load(fileContent);
};

/**
 * Recursively reads all YAML files from a directory.
 *
 * @param dirPath - Path to the directory
 * @returns Array of parsed YAML objects
 */
export const readYamlFilesRecursively = (dirPath: string): any[] => {
  let results: any[] = [];

  fs.readdirSync(dirPath).forEach((file) => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.lstatSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(readYamlFilesRecursively(fullPath));
    } else if (fullPath.endsWith('.yaml') || fullPath.endsWith('.yml')) {
      const parsedYaml = parseYamlFile(fullPath);
      results.push({ filePath: fullPath, data: parsedYaml });
    }
  });

  return results;
};

/**
 * Reads the content of a YAML file and returns it as a string.
 *
 * @param filePath - The path to the YAML file.
 * @returns The content of the YAML file as a string.
 */
export const readYamlFileContent = (filePath: string): string => {
  return fs.readFileSync(filePath, 'utf8');
};
