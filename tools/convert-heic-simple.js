import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const augustRetreatDir = path.join(__dirname, '../public/images/august retreat');

async function main() {
  console.log('HEIC to JPG Conversion Guide\n');
  console.log('Since automatic conversion has platform issues, here are your options:\n');
  
  try {
    const files = await fs.promises.readdir(augustRetreatDir);
    const heicFiles = files.filter(file => 
      file.toLowerCase().endsWith('.heic')
    );
    
    if (heicFiles.length === 0) {
      console.log('✓ No HEIC files found - all images are already converted!');
      return;
    }
    
    console.log(`Found ${heicFiles.length} HEIC file(s) that need conversion:\n`);
    heicFiles.forEach(file => console.log(`  - ${file}`));
    
    console.log('\n--- OPTION 1: Online Converter (Easiest) ---');
    console.log('1. Go to https://cloudconvert.com/heic-to-jpg');
    console.log('2. Upload each HEIC file');
    console.log('3. Download the JPG files');
    console.log('4. Replace the HEIC files in: public/images/august retreat/\n');
    
    console.log('--- OPTION 2: Using ImageMagick (If installed) ---');
    console.log('Run these commands in your terminal:\n');
    heicFiles.forEach(file => {
      const jpgName = file.replace(/\.heic$/i, '.jpg');
      console.log(`magick "${path.join(augustRetreatDir, file)}" "${path.join(augustRetreatDir, jpgName)}"`);
    });
    
    console.log('\n--- OPTION 3: macOS Preview (If on Mac) ---');
    console.log('1. Open each HEIC file in Preview');
    console.log('2. File > Export');
    console.log('3. Format: JPEG');
    console.log('4. Save as .jpg\n');
    
    console.log('After conversion, the page will automatically use the JPG files!');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

main();

