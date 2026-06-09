import { Jimp } from 'jimp';

async function processImage() {
  try {
    const userImgPath = 'C:\\Users\\DELL\\.gemini\\antigravity\\brain\\643346a1-384b-4160-afa1-63d22834c48d\\media__1780996887308.jpg';
    const bgImgPath = 'C:\\Users\\DELL\\.gemini\\antigravity\\brain\\643346a1-384b-4160-afa1-63d22834c48d\\development_studio_bg_1780997901098.png';
    const outPath = 'f:\\port\\public\\assets\\profile.jpg';

    console.log('Reading user image from:', userImgPath);
    const userImg = await Jimp.read(userImgPath);
    console.log('Reading background image from:', bgImgPath);
    const bgImg = await Jimp.read(bgImgPath);

    const userWidth = userImg.bitmap.width;
    const userHeight = userImg.bitmap.height;

    console.log(`User image dimensions: ${userWidth}x${userHeight}`);

    // Resize background image to match the user image size
    bgImg.resize({ w: userWidth, h: userHeight });

    // Sample the background color from top-left (x=10, y=10)
    const targetIdx = (10 + 10 * userWidth) * 4;
    const bgR = userImg.bitmap.data[targetIdx];
    const bgG = userImg.bitmap.data[targetIdx + 1];
    const bgB = userImg.bitmap.data[targetIdx + 2];
    console.log(`Sampled background color: RGB(${bgR}, ${bgG}, ${bgB})`);

    // Chroma key thresholds
    const thresholdMin = 110;
    const thresholdMax = 175;

    for (let y = 0; y < userHeight; y++) {
      for (let x = 0; x < userWidth; x++) {
        const idx = (x + y * userWidth) * 4;
        const r = userImg.bitmap.data[idx];
        const g = userImg.bitmap.data[idx + 1];
        const b = userImg.bitmap.data[idx + 2];

        // Euclidean color distance in RGB space
        const distance = Math.sqrt(
          Math.pow(r - bgR, 2) +
          Math.pow(g - bgG, 2) +
          Math.pow(b - bgB, 2)
        );

        if (distance < thresholdMin) {
          // Pure background pixel
          userImg.bitmap.data[idx] = bgImg.bitmap.data[idx];
          userImg.bitmap.data[idx + 1] = bgImg.bitmap.data[idx + 1];
          userImg.bitmap.data[idx + 2] = bgImg.bitmap.data[idx + 2];
        } else if (distance < thresholdMax) {
          // Transition / Blend region for smooth edges
          const ratio = (distance - thresholdMin) / (thresholdMax - thresholdMin);
          userImg.bitmap.data[idx] = Math.round(r * ratio + bgImg.bitmap.data[idx] * (1 - ratio));
          userImg.bitmap.data[idx + 1] = Math.round(g * ratio + bgImg.bitmap.data[idx + 1] * (1 - ratio));
          userImg.bitmap.data[idx + 2] = Math.round(b * ratio + bgImg.bitmap.data[idx + 2] * (1 - ratio));
        } else {
          // This is a user pixel. Apply a subtle rim light if near the edge.
          let isEdge = false;
          for (let dy = -2; dy <= 2 && !isEdge; dy++) {
            for (let dx = -2; dx <= 2; dx++) {
              const nx = x + dx;
              const ny = y + dy;
              if (nx >= 0 && nx < userWidth && ny >= 0 && ny < userHeight) {
                const nidx = (nx + ny * userWidth) * 4;
                const nr = userImg.bitmap.data[nidx];
                const ng = userImg.bitmap.data[nidx + 1];
                const nb = userImg.bitmap.data[nidx + 2];
                const ndist = Math.sqrt(Math.pow(nr - bgR, 2) + Math.pow(ng - bgG, 2) + Math.pow(nb - bgB, 2));
                if (ndist < thresholdMin) {
                  isEdge = true;
                  break;
                }
              }
            }
          }

          if (isEdge) {
            // Apply a soft blue/purple rim glow to blend with the lighting of the studio backlights
            userImg.bitmap.data[idx] = Math.round(r * 0.70 + 130 * 0.30);
            userImg.bitmap.data[idx + 1] = Math.round(g * 0.70 + 90 * 0.30);
            userImg.bitmap.data[idx + 2] = Math.round(b * 0.65 + 250 * 0.35);
          } else {
            // Color grading to match the studio portrait room:
            // 1. Lower exposure by 14% to fit dark room atmosphere
            let finalR = r * 0.86;
            let finalG = g * 0.86;
            let finalB = b * 0.86 * 1.06; // slight blue/cool shadows shift

            // 2. Increase contrast slightly by 10% (slight S-curve)
            const contrast = 1.1;
            finalR = ((finalR / 255 - 0.5) * contrast + 0.5) * 255;
            finalG = ((finalG / 255 - 0.5) * contrast + 0.5) * 255;
            finalB = ((finalB / 255 - 0.5) * contrast + 0.5) * 255;

            // Clamping
            userImg.bitmap.data[idx] = Math.max(0, Math.min(255, Math.round(finalR)));
            userImg.bitmap.data[idx + 1] = Math.max(0, Math.min(255, Math.round(finalG)));
            userImg.bitmap.data[idx + 2] = Math.max(0, Math.min(255, Math.round(finalB)));
          }
        }
      }
    }

    console.log('Writing processed image to:', outPath);
    await userImg.write(outPath);
    console.log('SUCCESS: Image chroma keying and blending complete!');
    process.exit(0);
  } catch (error) {
    console.error('Error during image processing:', error);
    process.exit(1);
  }
}

processImage();
