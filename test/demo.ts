import fs from 'fs';
import path from 'path';
import { blurNSFWFromURL } from '../src/node/blurNSFW';

async function run() {
  const url = 'https://example.com/path/to/your/image.jpg'; // Replace with your image URL
  const buffer = await blurNSFWFromURL({ imageUrl: url, blurRadius: 5 });
  fs.writeFileSync(path.join(__dirname, 'blurred-output.jpg'), buffer);
  console.log('Blurred image saved as test/blurred-output.jpg');
}

run().catch(console.error);
