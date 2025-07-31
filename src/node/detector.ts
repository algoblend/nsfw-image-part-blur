import * as nsfwjs from 'nsfwjs';
import * as tf from '@tensorflow/tfjs-node';

let model: nsfwjs.NSFWJS;

export async function loadModel() {
  if (!model) {
    const nsfwModel = await nsfwjs.load();
    model = nsfwModel;
  }
  return model;
}

export async function detectNSFWRegions(imageBuffer: Buffer): Promise<nsfwjs.predictionType[]> {
  const decoded = tf.node.decodeImage(imageBuffer, 3);
  const mdl = await loadModel();
  const predictions = await mdl.classify(decoded);
  decoded.dispose();
  return predictions;
}
