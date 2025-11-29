import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const augustRetreatDir = path.join(__dirname, '../public/images/august retreat');

async function compressImage(inputPath, outputPath) {
  try {
    const stats = await fs.promises.stat(inputPath);
    const originalSize = stats.size;
    
    // Compress JPEG with good quality but smaller file size
    await sharp(inputPath)
      .jpeg({ 
        quality: 80,  // Good balance between quality and file size
        mozjpeg: true, // Better compression
        progressive: true // Progressive JPEG for faster perceived loading
      })
      .toFile(outputPath);
    
    const newStats = await fs.promises.stat(outputPath);
    const newSize = newStats.size;
    const saved = ((originalSize - newSize) / originalSize * 100).toFixed(1);
    const savedMB = ((originalSize - newSize) / (1024 * 1024)).toFixed(2);
    
    console.log(`✓ ${path.basename(inputPath)}: ${(originalSize / 1024 / 1024).toFixed(2)}MB → ${(newSize / 1024 / 1024).toFixed(2)}MB (${saved}% saved, ${savedMB}MB)`);
    return true;
  } catch (error) {
    console.error(`✗ Error compressing ${inputPath}:`, error.message);
    return false;
  }
}

async function main() {
  console.log('Starting image compression for August retreat...\n');
  
  try {
    const files = await fs.promises.readdir(augustRetreatDir);
    const jpgFiles = files.filter(file => 
      file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg')
    );
    
    if (jpgFiles.length === 0) {
      console.log('No JPG files found to compress.');
      return;
    }
    
    console.log(`Found ${jpgFiles.length} JPG file(s) to compress:\n`);
    
    let totalOriginalSize = 0;
    let totalNewSize = 0;
    let compressed = 0;
    
    for (const jpgFile of jpgFiles) {
      const inputPath = path.join(augustRetreatDir, jpgFile);
      const tempPath = path.join(augustRetreatDir, `${jpgFile}.tmp`);
      
      const stats = await fs.promises.stat(inputPath);
      totalOriginalSize += stats.size;
      
      if (await compressImage(inputPath, tempPath)) {
        // Replace original with compressed version
        await fs.promises.rename(tempPath, inputPath);
        const newStats = await fs.promises.stat(inputPath);
        totalNewSize += newStats.size;
        compressed++;
      } else {
        // If compression failed, remove temp file
        try {
          await fs.promises.unlink(tempPath);
        } catch {}
      }
    }
    
    const totalSaved = ((totalOriginalSize - totalNewSize) / totalOriginalSize * 100).toFixed(1);
    const totalSavedMB = ((totalOriginalSize - totalNewSize) / (1024 * 1024)).toFixed(2);
    
    console.log(`\n✓ Compression complete!`);
    console.log(`  Compressed: ${compressed} file(s)`);
    console.log(`  Total size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB → ${(totalNewSize / 1024 / 1024).toFixed(2)}MB`);
    console.log(`  Saved: ${totalSaved}% (${totalSavedMB}MB)`);
    
  } catch (error) {
    console.error('Error:', error.message);
    if (error.message.includes('sharp')) {
      console.error('\n⚠️  Sharp module issue. Try:');
      console.error('   npm install --platform=linux --arch=x64 sharp');
      console.error('   Or use the Python compression script instead.');
    }
  }
}

main();

