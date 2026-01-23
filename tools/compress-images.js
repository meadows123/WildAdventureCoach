import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const imagesDir = path.join(__dirname, '../public/images');

async function compressImage(inputPath, outputPath) {
  try {
    const stats = await fs.promises.stat(inputPath);
    const originalSize = stats.size;
    
    const metadata = await sharp(inputPath).metadata();
    const ext = path.extname(inputPath).toLowerCase();
    
    let output;
    
    if (ext === '.png') {
      // Compress PNG
      output = await sharp(inputPath)
        .png({ quality: 85, compressionLevel: 9 })
        .toBuffer();
    } else if (['.jpg', '.jpeg'].includes(ext)) {
      // Compress JPEG
      output = await sharp(inputPath)
        .jpeg({ quality: 85, mozjpeg: true })
        .toBuffer();
    } else if (ext === '.webp') {
      // Compress WebP
      output = await sharp(inputPath)
        .webp({ quality: 85 })
        .toBuffer();
    } else {
      console.log(`Skipping ${inputPath} - unsupported format`);
      return;
    }
    
    const newSize = output.length;
    const saved = ((originalSize - newSize) / originalSize * 100).toFixed(1);
    
    await fs.promises.writeFile(outputPath, output);
    
    console.log(`✓ ${path.relative(imagesDir, inputPath)}: ${(originalSize / 1024).toFixed(1)}KB → ${(newSize / 1024).toFixed(1)}KB (${saved}% saved)`);
  } catch (error) {
    console.error(`✗ Error compressing ${inputPath}:`, error.message);
  }
}

async function compressDirectory(dir) {
  const entries = await fs.promises.readdir(dir, { withFileTypes: true });
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    
    if (entry.isDirectory()) {
      await compressDirectory(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
        await compressImage(fullPath, fullPath);
      }
    }
  }
}

async function main() {
  console.log('Starting image compression...\n');
  
  // Compress public/images
  if (fs.existsSync(imagesDir)) {
    console.log('Compressing public/images...');
    await compressDirectory(imagesDir);
  }
  
  // Also compress build/images if it exists
  const buildImagesDir = path.join(__dirname, '../build/images');
  if (fs.existsSync(buildImagesDir)) {
    console.log('\nCompressing build/images...');
    await compressDirectory(buildImagesDir);
  }
  
  console.log('\nCompression complete!');
}

main();

