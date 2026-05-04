'use strict';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { corsOptions } from './cors.configuration.js';
import { helmetOptions } from './helmet.configuration.js';
import { dbConnection } from './db.configuration.js';
import { requestLimit } from './rateLimit.configuration.js';
import { errorHandler } from '../src/middlewares/handle-errors.js';
import { swaggerDocs } from '../src/docs/swagger.js';
import classRoutes from '../src/routes/classes.js';
import participantRoutes from '../src/routes/participants.js';

const BASE_PATH = '/api/v1';

const routes = (app) => {
    app.use(`${BASE_PATH}/classes`, classRoutes);
    app.use(`${BASE_PATH}/participants`, participantRoutes);
    app.get(`${BASE_PATH}/health`, (req, res) => {
        res.status(200).json({
            status: 'Healthy',
            timeStamp: new Date().toISOString(),
            service: 'class-service'
        });
    });

    swaggerDocs(app);

    app.use((req, res) => {
        res.status(404).json({
            success: false,
            message: 'Endpoint not found'
        });
    });
};

const middlewares = (app) => {
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: false, limit: '10mb' }));
    app.use(cors(corsOptions));
    app.use(helmet(helmetOptions));
    app.use(morgan('dev'));
    app.use(requestLimit);
};

export const initServer = async () => {
    const app = express();

    // Initialize database connection
    await dbConnection();

    // Setup middlewares
    middlewares(app);

    // Setup routes
    routes(app);

    // Error handler
    app.use(errorHandler);

    return app;
};