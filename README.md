# nsfw-image-part-blur

Blur NSFW regions in images from URLs using TensorFlow and Sharp.

## Features

- Detects NSFW content using `nsfwjs`
- Blurs only specific regions (mocked box for now)
- Returns processed image as a `Buffer`
- Works in Node.js (browser support coming soon)

## Install

```bash
npm install nsfw-image-part-blur
```

## Usage

```ts
import { blurNSFWFromURL } from 'nsfw-image-part-blur';

const result = await blurNSFWFromURL({
  imageUrl: 'https://example.com/adult.jpg',
  blurRadius: 25
});
```

## License

MIT