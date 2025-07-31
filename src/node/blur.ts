import sharp from 'sharp';

/**
 * Blur specified rectangular regions in the image.
 * @param imageBuffer Original image as buffer
 * @param boxes Array of bounding boxes: [x, y, width, height]
 * @param blurRadius How much blur to apply
 */
export async function blurRegions(
  imageBuffer: Buffer,
  boxes: Array<[number, number, number, number]>,
  blurRadius: number = 30
): Promise<Buffer> {
  const base = sharp(imageBuffer);
  const { width, height } = await base.metadata();

  if (!width || !height) {
    throw new Error('Invalid image dimensions');
  }

  const overlays = await Promise.all(
    boxes.map(async ([x, y, w, h], idx) => {
      // Clamp box to image bounds
      const left = Math.max(0, x);
      const top = Math.max(0, y);
      const right = Math.min(width, left + w);
      const bottom = Math.min(height, top + h);
      const boxWidth = right - left;
      const boxHeight = bottom - top;

      if (
        boxWidth <= 0 || boxHeight <= 0 ||
        left >= width || top >= height
      ) {
        throw new Error(`Invalid extract area for box #${idx}: [${x}, ${y}, ${w}, ${h}] (image: ${width}x${height})`);
      }

      const region = await base.extract({ left, top, width: boxWidth, height: boxHeight }).blur(blurRadius).toBuffer();
      return {
        input: region,
        top: top,
        left: left,
      };
    })
  );

  return base.composite(overlays).toBuffer();
}
