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
    boxes.map(async ([x, y, w, h]) => {
      const region = await base.extract({ left: x, top: y, width: w, height: h }).blur(blurRadius).toBuffer();
      return {
        input: region,
        top: y,
        left: x,
      };
    })
  );

  return base.composite(overlays).toBuffer();
}
