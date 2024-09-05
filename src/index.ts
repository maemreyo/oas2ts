// src/index.ts
import { loadConfig } from './config';
import { loadFile } from './core/fileLoader';
import { resolveRefs } from './core/refResolver';
import { generateTypeScriptFiles } from './core/typeGenerator';
import { handleError } from './shared/errorHandler';
import { logInfo } from './shared/logger';
import { parseCLIArgs } from './cli';

async function processOpenApiFile(openApiFilePath: string, outputDir: string) {
  const config = loadConfig();
  try {
    const openApiData = await loadFile(openApiFilePath);
    const resolvedOpenApiData = await resolveRefs(openApiData, config);
    await generateTypeScriptFiles(resolvedOpenApiData, outputDir);
    logInfo('Typescript files generated successfully!');
  } catch (error) {
    if (error instanceof Error) {
      handleError(error);
    } else {
      handleError(new Error(String(error)));
    }
  }
}

const argv = parseCLIArgs();

processOpenApiFile(argv.input, argv.output)
  .then(() => logInfo('Process completed'))
  .catch((error) => {
    if (error instanceof Error) {
      handleError(error);
    } else {
      handleError(new Error(String(error)));
    }
  });
