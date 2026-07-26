const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');
const authMiddleware = require('./middleware/authMiddleware');
const errorHandler = require('./utils/errorHandler');
const inscriptionRoutes = require('./routes/inscriptions');

const app = express();

// Middleware
app.use(cors());
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'inscription-service', db: 'disconnected' });
});

app.use('/api/inscriptions', authMiddleware, inscriptionRoutes);

// MongoDB Connection
console.log('MongoDB URI:', process.env.MONGODB_URI);
mongoose.connect(process.env.MONGODB_URI, {
    serverSelectionTimeoutMS: 5000,
    maxPoolSize: 10,
})
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err.message));

// Enable mongoose debug to log operations (helpful for auth failures)
try { mongoose.set('debug', true); } catch (e) {}

// 404 Handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use(errorHandler);

module.exports = app;
