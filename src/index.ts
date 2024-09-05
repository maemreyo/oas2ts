// src/index.ts
import { loadConfig } from './config';
import { resolveRefs } from './core/refResolver';
import { generateTypeScriptFiles } from './core/typeGenerator';
import logger from './shared/logger';
import { parseCLIArgs } from './cli';
import { loadYamlFile } from './core/fileLoader';

async function processOpenApiFile(openApiFilePath: string, outputDir: string) {
  const config = loadConfig();
  try {
    const openApiData = await loadYamlFile(openApiFilePath);
    const resolvedOpenApiData = await resolveRefs(openApiData, config);
    await generateTypeScriptFiles(resolvedOpenApiData, outputDir);
    logger.info('Typescript files generated successfully!');
  } catch (error) {
    if (error instanceof Error) {
      logger.error(error);
    } else {
      logger.error(new Error(String(error)));
    }
  }
}

// Get CLI arguments
const argv = parseCLIArgs();

processOpenApiFile(argv.input, argv.output)
  .then(() => logger.info('Process completed'))
  .catch((error) => {
    if (error instanceof Error) {
      logger.error(error);
    } else {
      logger.error(new Error(String(error)));
    }
  });
