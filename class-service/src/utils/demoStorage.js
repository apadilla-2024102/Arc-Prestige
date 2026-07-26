import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataDir = path.resolve(__dirname, '../../data');

async function ensureDataDir() {
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (e) {
    // ignore
  }
}

async function load(fileName) {
  await ensureDataDir();
  const filePath = path.join(dataDir, fileName);
  try {
    const file = await fs.readFile(filePath, 'utf8');
    return JSON.parse(file || '[]');
  } catch (err) {
    return [];
  }
}

async function append(fileName, item) {
  const arr = await load(fileName);
  arr.push(item);
  const filePath = path.join(dataDir, fileName);
  await fs.writeFile(filePath, JSON.stringify(arr, null, 2), 'utf8');
  return item;
}

export { load, append };
