const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const images = ['NEW1.jpeg', 'NEW2.jpeg'];
const inputDir = path.join(process.cwd(), 'public/images');

async function convert() {
  for (const image of images) {
    const inputPath = path.join(inputDir, image);
    const outputPath = path.join(inputDir, image.replace('.jpeg', '.webp').toLowerCase());
    
    try {
      if (fs.existsSync(inputPath)) {
        console.log(`Converting ${image}...`);
        await sharp(inputPath)
          .webp({ quality: 80 })
          .toFile(outputPath);
        console.log(`Created ${outputPath}`);
      } else {
        console.error(`File not found: ${inputPath}`);
      }
    } catch (error) {
      console.error(`Error converting ${image}:`, error);
    }
  }
}

convert();
