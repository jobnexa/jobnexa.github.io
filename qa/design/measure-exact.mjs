import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';

const file = process.argv[2];
const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
const counts = new Map();
for (let i = 0; i < data.length; i += info.channels) {
  const value = `#${data[i].toString(16).padStart(2, '0')}${data[i + 1].toString(16).padStart(2, '0')}${data[i + 2].toString(16).padStart(2, '0')}`;
  counts.set(value, (counts.get(value) || 0) + 1);
}
const palette = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 16).map(([hex, pixels]) => ({ hex, pixels, coverage: pixels / (info.width * info.height) }));
await writeFile(new URL('./reference-exact-colors.json', import.meta.url), JSON.stringify({ method: 'Exact RGB pixel frequency; complements perceptually merged clusters', palette }, null, 2));
console.log(JSON.stringify(palette, null, 2));
