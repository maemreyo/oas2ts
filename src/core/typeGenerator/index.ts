// @ts-nocheck
import * as path from 'path';
import * as fs from 'fs-extra';
import yaml from 'js-yaml';
import {
  applyInterfaceNamingConvention,
  applyPropertyNamingConvention,
} from '../../shared/namingConvention';
import { generateOutputFileName } from '../../infrastructure/fileNameHandler';
import { parseSchema, handleSpecialTypes } from '../schemaParser';
import logger from '../../shared/logger';
import { resolveRefs } from '../refResolver';

export function generateTypeScriptInterface(
  schemaName: string,
  properties: any,
): string {
  logger.info('Generating TypeScript interface...', { schemaName });

  const lines = Object.keys(properties).map((propName) => {
    const prop = properties[propName];
    const tsType = handleSpecialTypes(prop) || 'any';
    const requiredFlag = prop.required ? '' : '?';
    logger.info('Processed property for interface', {
      propName,
      tsType,
      requiredFlag,
    });
    return `  ${applyPropertyNamingConvention(propName)}${requiredFlag}: ${tsType};`;
  });

  const interfaceName = applyInterfaceNamingConvention(schemaName);
  logger.info('Generated interface name:', { interfaceName });

  return `export interface ${interfaceName} {\n${lines.join('\n')}\n}`;
}

export async function generateTypeScriptFiles(
  resolvedData: any,
  outputDir: string,
) {
  logger.info('Starting to process resolved data...');

  // Kiểm tra nếu resolvedData là chuỗi JSON hoặc YAML
  if (typeof resolvedData === 'string') {
    logger.info(
      'Resolved data is a string, attempting to parse as JSON or YAML',
    );

    try {
      // Thử parse nếu là JSON
      resolvedData = JSON.parse(resolvedData);
      logger.info('Resolved data parsed as JSON:', { resolvedData });
    } catch (jsonError) {
      logger.warn('Failed to parse as JSON, trying YAML', { jsonError });

      try {
        // Nếu không thành công, thử parse như YAML
        resolvedData = yaml.load(resolvedData);
        logger.info('Resolved data parsed as YAML:', { resolvedData });
      } catch (yamlError) {
        logger.error('Failed to parse resolvedData as JSON or YAML', {
          jsonError,
          yamlError,
        });
        return; // Thoát nếu không parse được
      }
    }
  } else {
    logger.info(
      'Resolved data is not a string, continuing with object data...',
    );
  }

  // Xử lý components schemas
  if (resolvedData.components && resolvedData.components.schemas) {
    logger.info('Found schemas in components:', {
      schemas: resolvedData.components.schemas,
    });

    for (const schemaName in resolvedData.components.schemas) {
      const schema = resolvedData.components.schemas[schemaName];
      const properties = schema.properties || {};

      logger.info(`Processing schema: ${schemaName}`, { properties });

      const tsInterface = generateTypeScriptInterface(schemaName, properties);
      logger.info({ tsInterface });
      const outputFilePath = path.join(
        outputDir,
        generateOutputFileName(schemaName),
      );

      try {
        await fs.writeFile(outputFilePath, tsInterface, 'utf8');
        logger.info('Generated TypeScript interface', {
          schemaName,
          outputFilePath,
        });
      } catch (writeError) {
        logger.error('Error writing TypeScript file', {
          schemaName,
          outputFilePath,
          error: writeError,
        });
      }
    }
  } else {
    logger.warn('No schemas found in components.');
  }

  // Xử lý các path refs
  if (resolvedData.paths) {
    logger.info('Found paths in OpenAPI:', { paths: resolvedData.paths });

    for (const pathName in resolvedData.paths) {
      logger.info(`Processing path: ${pathName}`);
      const pathData = resolvedData.paths[pathName];

      const resolvedPathData = await resolveRefs(pathData, {
        baseDir: outputDir,
        refDirs: ['paths', 'components'],
      });

      logger.info(`Processed path: ${pathName}`, { resolvedPathData });
      logger.info(
        'REQUESTBODY??',
        !!resolvedPathData &&
          !!resolvedPathData.requestBody &&
          !!resolvedPathData.requestBody.content,
      );
      // Xử lý requestBody nếu có
      if (
        // resolvedPathData &&
        // resolvedPathData.requestBody &&
        // resolvedPathData.requestBody.content
        true
      ) {
        for (const contentType in resolvedPathData.requestBody.content) {
          logger.info({ contentType });
          const contentSchema =
            resolvedPathData.requestBody.content[contentType].schema;
          logger.info({ contentSchema });
          if (contentSchema && contentSchema.properties) {
            const interfaceName = `${pathName.replace(/[\/{}]/g, '_')}RequestBody`;
            logger.info({ interfaceName });
            const tsInterface = generateTypeScriptInterface(
              interfaceName,
              contentSchema.properties,
            );
            logger.info({ tsInterface });
            const outputFilePath = path.join(
              outputDir,
              generateOutputFileName(interfaceName),
            );
            logger.info(
              `Attempting to write requestBody interface for path: ${pathName}`,
              { interfaceName, outputFilePath },
            );

            try {
              await fs.writeFile(outputFilePath, tsInterface, 'utf8');
              logger.info('Generated TypeScript interface for requestBody', {
                interfaceName,
                outputFilePath,
              });
            } catch (writeError) {
              logger.error('Error writing TypeScript file for requestBody', {
                interfaceName,
                outputFilePath,
                error: writeError,
              });
            }
          }
        }
      }

      // Xử lý responses nếu có
      if (resolvedPathData && resolvedPathData.responses) {
        logger.info('Found responses for the path', { pathName });

        for (const statusCode in resolvedPathData.responses) {
          const responseSchema =
            resolvedPathData.responses[statusCode].content?.['application/json']
              ?.schema;

          if (responseSchema && responseSchema.properties) {
            const interfaceName = `${pathName.replace(/[\/{}]/g, '_')}_Response_${statusCode}`;
            const tsInterface = generateTypeScriptInterface(
              interfaceName,
              responseSchema.properties,
            );

            const outputFilePath = path.join(
              outputDir,
              generateOutputFileName(interfaceName),
            );
            logger.info(
              `Attempting to write response interface for path: ${pathName}, status code: ${statusCode}`,
              { interfaceName, outputFilePath },
            );

            try {
              await fs.writeFile(outputFilePath, tsInterface, 'utf8');
              logger.info('Generated TypeScript interface for response', {
                interfaceName,
                outputFilePath,
              });
            } catch (writeError) {
              logger.error('Error writing TypeScript file for response', {
                interfaceName,
                outputFilePath,
                error: writeError,
              });
            }
          }
        }
      } else {
        logger.info('No responses found for the path', { pathName });
      }

      // Xử lý parameters nếu có
      if (resolvedPathData && resolvedPathData.parameters) {
        logger.info('Found parameters for the path', { pathName });

        const paramsInterfaceName = `${pathName.replace(/[\/{}]/g, '_')}Parameters`;
        const paramsProperties = {};
        resolvedPathData.parameters.forEach((param) => {
          if (param.schema) {
            paramsProperties[param.name] = param.schema;
          }
        });

        if (Object.keys(paramsProperties).length > 0) {
          const tsInterface = generateTypeScriptInterface(
            paramsInterfaceName,
            paramsProperties,
          );

          const outputFilePath = path.join(
            outputDir,
            generateOutputFileName(paramsInterfaceName),
          );
          logger.info(
            `Attempting to write parameters interface for path: ${pathName}`,
            { paramsInterfaceName, outputFilePath },
          );

          try {
            await fs.writeFile(outputFilePath, tsInterface, 'utf8');
            logger.info('Generated TypeScript interface for parameters', {
              paramsInterfaceName,
              outputFilePath,
            });
          } catch (writeError) {
            logger.error('Error writing TypeScript file for parameters', {
              paramsInterfaceName,
              outputFilePath,
              error: writeError,
            });
          }
        }
      } else {
        logger.info('No parameters found for the path', { pathName });
      }
    }
  } else {
    logger.warn('No paths found in OpenAPI specification.');
  }
}
