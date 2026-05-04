import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const swaggerDefinition = {
    openapi: '3.0.0',
    info: {
        title: 'Class Service API',
        version: '1.0.0',
        description: 'Documentación de la API de class-service',
    },
    servers: [
        {
            url: 'http://localhost:3002/api/v1',
            description: 'Servidor local',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
            },
        },
        schemas: {
            ClassCreation: {
                type: 'object',
                properties: {
                    name: { type: 'string', example: 'Clase básica de tiro con arco' },
                    description: { type: 'string', example: 'Sesión para principiantes' },
                    instructorId: { type: 'string', example: 'user-123' },
                    instructorName: { type: 'string', example: 'María Pérez' },
                    schedule: {
                        type: 'object',
                        properties: {
                            day: { type: 'string', example: 'Lunes' },
                            startTime: { type: 'string', example: '09:00' },
                            endTime: { type: 'string', example: '11:00' },
                        },
                    },
                    level: { type: 'string', example: 'beginner' },
                    maxCapacity: { type: 'integer', example: 20 },
                },
                required: ['name', 'instructorId', 'instructorName', 'schedule'],
            },
            StudentAssignment: {
                type: 'object',
                properties: {
                    studentId: { type: 'string', example: 'student-456' },
                    studentName: { type: 'string', example: 'Juan López' },
                },
                required: ['studentId', 'studentName'],
            },
            ParticipantAction: {
                type: 'object',
                properties: {
                    participantId: { type: 'string', example: 'student-456' },
                },
                required: ['participantId'],
            },
        },
    },
    security: [{ bearerAuth: [] }],
};

const options = {
    swaggerDefinition,
    apis: ['./src/routes/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

export const swaggerDocs = (app) => {
    app.use('/api/v1/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
    app.get('/api/v1/docs.json', (req, res) => res.json(swaggerSpec));
};
