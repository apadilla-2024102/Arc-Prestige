import 'dotenv/config';
import { initServer } from '../configs/app.js';

const PORT = process.env.PORT || 3002;

const startServer = async () => {
    const app = await initServer();

    app.listen(PORT, () => {
        console.log(`ClassService running on port ${PORT}`);
    });
};

startServer();
