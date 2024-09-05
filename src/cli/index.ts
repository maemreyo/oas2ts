// src/cli/index.ts
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

export function parseCLIArgs() {
  const argv = yargs(hideBin(process.argv))
    .option('input', {
      alias: 'i',
      type: 'string',
      description: 'Input OpenAPI YAML file',
      demandOption: true,
    })
    .option('output', {
      alias: 'o',
      type: 'string',
      description: 'Output directory for generated TypeScript files',
      demandOption: true,
    })
    .help()
    .parseSync();

  return argv;
}
