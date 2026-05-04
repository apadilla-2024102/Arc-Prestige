require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const authMiddleware = require('./middleware/authMiddleware');
const errorHandler = require('./utils/errorHandler');
const reportRoutes = require('./routes/reports');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'report-service' });
});

// Routes
app.use('/api/reports', authMiddleware, reportRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use(errorHandler);

module.exports = app;
