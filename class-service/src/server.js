import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });
import { initServer } from '../configs/app.js';

const PORT = process.env.PORT || 3002;

const startServer = async () => {
    const app = await initServer();

    app.listen(PORT, () => {
        console.log(`ClassService running on port ${PORT}`);
    });
};

startServer();
