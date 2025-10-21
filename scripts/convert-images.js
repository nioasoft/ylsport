const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const PHOTOS_DIR = path.join(__dirname, '../photos');
const OUTPUT_DIR = path.join(__dirname, '../public/images');

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function convertToWebP() {
  console.log('🖼️  Converting images to WebP...\n');

  const files = fs.readdirSync(PHOTOS_DIR);

  for (const file of files) {
    if (file.endsWith('.jpeg') || file.endsWith('.jpg')) {
      const inputPath = path.join(PHOTOS_DIR, file);
      const outputName = file.replace(/\.(jpeg|jpg)$/i, '.webp');
      const outputPath = path.join(OUTPUT_DIR, outputName);

      try {
        await sharp(inputPath)
          .webp({ quality: 85 })
          .toFile(outputPath);

        const inputStats = fs.statSync(inputPath);
        const outputStats = fs.statSync(outputPath);
        const saved = ((inputStats.size - outputStats.size) / inputStats.size * 100).toFixed(1);

        console.log(`✓ ${file} → ${outputName}`);
        console.log(`  ${(inputStats.size / 1024).toFixed(1)}KB → ${(outputStats.size / 1024).toFixed(1)}KB (${saved}% saved)\n`);
      } catch (error) {
        console.error(`✗ Failed to convert ${file}:`, error.message);
      }
    } else if (file.endsWith('.svg')) {
      // Copy SVG files as-is
      const inputPath = path.join(PHOTOS_DIR, file);
      const outputPath = path.join(OUTPUT_DIR, file);
      fs.copyFileSync(inputPath, outputPath);
      console.log(`✓ Copied ${file}\n`);
    }
  }

  console.log('✅ Image conversion complete!');
}

convertToWebP().catch(console.error);
