import * as path from 'path';

export const config = {
  schemaDirectory: path.resolve(__dirname, '../../mocks/input/schemas'),
  outputDirectory: path.resolve(__dirname, '../../mocks/output/types'),
  logLevel: process.env.LOG_LEVEL || 'info',
};
