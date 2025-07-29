import express, { Express } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import connectDB from './db/DBConnection';
import { env } from './config/env.config';
import { errorHandler, notFound } from './middleware/error.middleware';
import { authenticateToken } from './middleware/auth.middleware';

import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import subscriptionRoutes from './routes/emailsubscription.routes';
import contactRoutes from './routes/contact.routes'; // optional

dotenv.config();

const app: Express = express();

// Middleware
app.use(cors({ origin: ['http://localhost:5173'], credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
    const dbStatus = mongoose.connection.readyState;
    const statusMap: Record<number, string> = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting',
    };

    res.status(200).json({
        status: 'ok',
        timestamp: new Date(),
        database: {
            status: statusMap[dbStatus] || 'unknown',
            connection: process.env.MONGO_URI ? 'Configured' : 'Not configured',
            dbName: mongoose.connection.db?.databaseName || 'Not connected',
        },
    });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', authenticateToken, orderRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/contact', contactRoutes); // optional

// 404 and error handlers
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();

        app.listen(PORT, () => {
            console.log(`🚀 Server running at http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('❌ Failed to start server:', err);
        process.exit(1);
    }
};

startServer();
