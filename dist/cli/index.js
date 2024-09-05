"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseCLIArgs = void 0;
// src/cli/index.ts
const yargs_1 = __importDefault(require("yargs"));
const helpers_1 = require("yargs/helpers");
function parseCLIArgs() {
    const argv = (0, yargs_1.default)((0, helpers_1.hideBin)(process.argv))
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
exports.parseCLIArgs = parseCLIArgs;
