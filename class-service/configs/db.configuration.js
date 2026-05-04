import mongoose from 'mongoose';

export const dbConnection = async () => {
    try {
        mongoose.connection.on('error', () => {
            console.error('MongoDB | Connection error');
            mongoose.disconnect();
        });
        mongoose.connection.on('connecting', () => {
            console.log('MongoDB | Attempting to connect to MongoDB');
        });
        mongoose.connection.on('connected', () => {
            console.log('MongoDB | Connected to MongoDB');
        });
        mongoose.connection.on('open', () => {
            console.log('MongoDB | Connected to database');
        });
        mongoose.connection.on('reconnected', () => {
            console.log('MongoDB | Reconnected to MongoDB');
        });
        mongoose.connection.on('disconnected', () => {
            console.log('MongoDB | Disconnected from MongoDB');
        });
        await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            maxPoolSize: 10,
        });
    } catch (err) {
        console.error(`Class Service - Error connecting to DB: ${err.message}`);
        process.exit(1);
    }
};

const gracefulShutdown = async (signal) => {
    console.log(`MongoDB | Received ${signal} signal, closing MongoDB connection...`);
    try {
        await mongoose.disconnect();
        console.log('MongoDB | Connection closed successfully');
        process.exit(0);
    } catch (err) {
        console.error(`MongoDB | Error during connection closure: ${err.message}`);
        process.exit(1);
    }
};

process.on('SIGINT', () => gracefulShutdown('SIGINT'));
process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGUSR2', () => gracefulShutdown('SIGUSR2'));