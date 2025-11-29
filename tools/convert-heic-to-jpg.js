import convert from 'heic-convert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const augustRetreatDir = path.join(__dirname, '../public/images/august retreat');

async function convertHeicToJpg(inputPath, outputPath) {
  try {
    console.log(`Converting ${path.basename(inputPath)} to JPG...`);
    
    const inputBuffer = await fs.promises.readFile(inputPath);
    const outputBuffer = await convert({
      buffer: inputBuffer,
      format: 'JPEG',
      quality: 0.9
    });
    
    await fs.promises.writeFile(outputPath, Buffer.from(outputBuffer));
    
    const stats = await fs.promises.stat(outputPath);
    console.log(`✓ ${path.basename(outputPath)} created (${(stats.size / 1024).toFixed(1)}KB)`);
  } catch (error) {
    console.error(`✗ Error converting ${inputPath}:`, error.message);
  }
}

async function main() {
  console.log('Starting HEIC to JPG conversion...\n');
  
  try {
    const files = await fs.promises.readdir(augustRetreatDir);
    const heicFiles = files.filter(file => 
      file.toLowerCase().endsWith('.heic')
    );
    
    if (heicFiles.length === 0) {
      console.log('No HEIC files found to convert.');
      return;
    }
    
    console.log(`Found ${heicFiles.length} HEIC file(s) to convert:\n`);
    
    for (const heicFile of heicFiles) {
      const inputPath = path.join(augustRetreatDir, heicFile);
      const jpgFile = heicFile.replace(/\.heic$/i, '.jpg');
      const outputPath = path.join(augustRetreatDir, jpgFile);
      
      // Skip if JPG already exists
      try {
        await fs.promises.access(outputPath);
        console.log(`⏭️  Skipping ${heicFile} - ${jpgFile} already exists`);
        continue;
      } catch {
        // File doesn't exist, proceed with conversion
      }
      
      await convertHeicToJpg(inputPath, outputPath);
    }
    
    console.log('\n✓ Conversion complete!');
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();

