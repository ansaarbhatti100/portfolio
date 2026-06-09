import { Jimp } from 'jimp';
import fs from 'fs';
import path from 'path';

async function compress() {
  try {
    const assetsDir = 'f:\\port\\public\\assets';
    const files = ['profile.jpg', 'project1.jpg', 'project2.jpg', 'project3.jpg', 'project4.jpg'];

    for (const file of files) {
      const filePath = path.join(assetsDir, file);
      if (fs.existsSync(filePath)) {
        const originalSize = fs.statSync(filePath).size;
        console.log(`Processing ${file} (Original Size: ${Math.round(originalSize / 1024)} KB)...`);
        
        const img = await Jimp.read(filePath);
        const originalWidth = img.bitmap.width;

        // Resize to a max width of 800px to optimize mobile layout weight
        if (originalWidth > 800) {
          const ratio = 800 / originalWidth;
          const newHeight = Math.round(img.bitmap.height * ratio);
          img.resize({ w: 800, h: newHeight });
          console.log(`  Resized from ${originalWidth}px to 800px width.`);
        }

        // Overwrite the file with 75% quality compression
        await img.write(filePath, { quality: 75 });
        
        const newSize = fs.statSync(filePath).size;
        const savingPercent = Math.round(((originalSize - newSize) / originalSize) * 100);
        console.log(`  Completed. New Size: ${Math.round(newSize / 1024)} KB (Saved ${savingPercent}%!)`);
      } else {
        console.log(`Warning: File ${file} not found in ${assetsDir}`);
      }
    }
    console.log('SUCCESS: All asset images compressed and optimized!');
    process.exit(0);
  } catch (error) {
    console.error('Error during image compression:', error);
    process.exit(1);
  }
}

compress();
