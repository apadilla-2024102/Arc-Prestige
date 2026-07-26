const fs = require('fs').promises;
const path = require('path');

const dataDir = path.resolve(__dirname, '../../data');

async function ensureDataDir() {
    try {
        await fs.mkdir(dataDir, { recursive: true });
    } catch (e) {}
}

async function load(fileName) {
    await ensureDataDir();
    const file = path.join(dataDir, fileName);
    try {
        const text = await fs.readFile(file, 'utf8');
        return JSON.parse(text || '[]');
    } catch (err) {
        return [];
    }
}

async function append(fileName, item) {
    const arr = await load(fileName);
    arr.push(item);
    const file = path.join(dataDir, fileName);
    await fs.writeFile(file, JSON.stringify(arr, null, 2), 'utf8');
    return item;
}

module.exports = { load, append };
