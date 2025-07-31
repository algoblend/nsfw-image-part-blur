import nsfwjs, { NSFWJS } from 'nsfwjs';
import * as tf from '@tensorflow/tfjs-node';

let model: NSFWJS;

export async function loadModel() {
  if (!model) {
    model = await nsfwjs.load("MobileNetV2"); // Load NSFW model from CDN
  }
  return model;
}

export async function detectNSFWRegions(imageBuffer: Buffer): Promise<
  { className: string; probability: number }[]
> {
  // Explicit cast to Tensor3D to fix the error
  const decoded = tf.node.decodeImage(imageBuffer, 3) as tf.Tensor3D;

  const mdl = await loadModel();
  const predictions = await mdl.classify(decoded);
  decoded.dispose();
  return predictions;
}
