// generate-icons.js - ES Module version
import sharp from 'sharp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [72, 96, 128, 144, 152, 192, 384, 512];
const inputIcon = path.join(__dirname, 'public', 'G.png');
const outputDir = path.join(__dirname, 'public', 'icons');

console.log('Looking for input icon at:', inputIcon);
console.log('Output directory:', outputDir);

// Check if input file exists
if (!fs.existsSync(inputIcon)) {
  console.error('❌ Input file not found:', inputIcon);
  console.log('Please make sure G.png exists in the public folder');
  process.exit(1);
}

// Create output directory if it doesn't exist
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log('✅ Created icons directory');
}

let generatedCount = 0;

// Use async/await for better error handling
async function generateIcons() {
  try {
    for (const size of sizes) {
      await sharp(inputIcon)
        .resize(size, size)
        .png()
        .toFile(path.join(outputDir, `icon-${size}x${size}.png`));
      
      console.log(`✅ Generated icon-${size}x${size}.png`);
      generatedCount++;
    }
    
    console.log('\n🎉 All icons generated successfully!');
    console.log('📁 Icons are saved in: public/icons/');
  } catch (error) {
    console.error('❌ Error generating icons:', error.message);
  }
}

generateIcons();