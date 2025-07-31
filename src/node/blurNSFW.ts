import fetch from 'node-fetch';
import { detectNSFWRegions } from './detector';
import { blurRegions } from './blur';

/**
 * Download an image from a URL and return a Buffer.
 */
async function fetchImageBuffer(imageUrl: string): Promise<Buffer> {
  const response = await fetch(imageUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  return Buffer.from(await response.arrayBuffer());
}

/**
 * Blur NSFW parts of the image from a URL.
 * Currently applies blur over the whole image if NSFW is detected.
 */
export async function blurNSFWFromURL(params: {
  imageUrl: string;
  blurRadius?: number;
}): Promise<Buffer> {
  const { imageUrl, blurRadius = 30 } = params;

  const imageBuffer = await fetchImageBuffer(imageUrl);

  const predictions = await detectNSFWRegions(imageBuffer);
  const nsfwTypes = ['Porn', 'Hentai', 'Sexy'];
  const isNSFW = predictions.some(p => nsfwTypes.includes(p.className) && p.probability > 0.8);

  if (!isNSFW) {
    return imageBuffer;
  }

  const mockBox: [number, number, number, number] = [100, 100, 300, 300];

  return await blurRegions(imageBuffer, [mockBox], blurRadius);
}
