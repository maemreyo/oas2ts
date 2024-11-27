"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
function generateIndexFile(directoryPath) {
    const absolutePath = path.resolve(directoryPath);
    console.log('Resolved directory path:', absolutePath); // Log the absolute path
    const indexPath = path.join(absolutePath, 'index.ts');
    // Check if directory exists
    if (!fs.existsSync(absolutePath)) {
        console.error(`Directory does not exist: ${absolutePath}`);
        return;
    }
    // Read all files from the directory
    fs.readdir(absolutePath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return;
        }
        // Filter out TypeScript files (.ts), ignoring index.ts itself
        const tsFiles = files.filter((file) => file.endsWith('.ts') && file !== 'index.ts');
        // Create export lines for each file
        const exportLines = tsFiles
            .map((file) => {
            const fileNameWithoutExt = path.basename(file, '.ts');
            return `export * from './${fileNameWithoutExt}';`;
        })
            .join('\n');
        // Write the export lines to index.ts
        fs.writeFile(indexPath, exportLines, (err) => {
            if (err) {
                console.error('Error writing index.ts file:', err);
            }
            else {
                console.log('index.ts has been created successfully.');
            }
        });
    });
}
// Call the function with the path to your parameters directory
generateIndexFile('./mocks/output/parameters');
