import * as fs from 'fs';
import * as path from 'path';

function generateIndexFile(directoryPath: string) {
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
    const tsFiles = files.filter(
      (file) => file.endsWith('.ts') && file !== 'index.ts',
    );

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
      } else {
        console.log('index.ts has been created successfully.');
      }
    });
  });
}

// Call the function with the path to your parameters directory
generateIndexFile('./mocks/output/parameters');
