import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { config } from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './db/DBConnection';
import { env } from './config/env.config';
import { errorHandler, notFound } from './middleware/error.middleware';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import productRoutes from './routes/product.routes';
import orderRoutes from './routes/order.routes';
import subscriptionRoutes from './routes/emailsubscription.routes'; // <-- ADDED THIS IMPORT
import { authenticateToken } from './middleware/auth.middleware';

// Load environment variables
config();

const app: Express = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS Configuration - ***Corrected to http://localhost:5173***
app.use(cors({
  origin: ['http://localhost:5173'], // THIS IS THE CORRECTED PORT FOR YOUR FRONTEND
  credentials: true
}));

// Health check endpoint with DB status
app.get('/api/health', (req: Request, res: Response) => {
  const dbStatus = mongoose.connection.readyState;
  let dbStatusText = '';

  switch(dbStatus) {
    case 0: dbStatusText = 'disconnected'; break;
    case 1: dbStatusText = 'connected'; break;
    case 2: dbStatusText = 'connecting'; break;
    case 3: dbStatusText = 'disconnecting'; break;
    default: dbStatusText = 'unknown'; // Added default case for robustness
  }

  res.status(200).json({
    status: 'ok',
    timestamp: new Date(),
    database: {
      status: dbStatusText,
      connection: process.env.MONGO_URI ? 'Configured' : 'Not configured',
      dbName: mongoose.connection.db?.databaseName || 'Not connected'
    }
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users',  userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', authenticateToken, orderRoutes);
app.use('/api/subscriptions', subscriptionRoutes); // <-- ADDED THIS LINE TO USE SUBSCRIPTION ROUTES

// 404 Handler
app.use(notFound);

// Error Handler
app.use(errorHandler);

// Use port from environment configuration
const PORT = env.PORT || 3000; // Added default 3000 if env.PORT is not set

const startServer = async () => {
  try {
    // Connect to database
    try {
      await connectDB();
    } catch (dbError) {
      console.error('❌ Failed to connect to database:', dbError instanceof Error ? dbError.message : 'Unknown error');
      process.exit(1);
    }

    // Start the server
    const server = app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health\n`);
    });

    // Handle server errors
    server.on('error', (error: NodeJS.ErrnoException) => {
      if (error.syscall !== 'listen') throw error;

      // Handle specific listen errors with friendly messages
      switch (error.code) {
        case 'EACCES':
          console.error(`Port ${PORT} requires elevated privileges`);
          process.exit(1);
          break;
        case 'EADDRINUSE':
          console.error(`Port ${PORT} is already in use`);
          process.exit(1);
          break;
        default:
          throw error;
      }
    });

    // Handle process termination
    process.on('SIGINT', () => {
      console.log('\nGracefully shutting down from SIGINT (Ctrl+C)');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    if (env.NODE_ENV === 'development') {
      console.log(`🚀 Starting in ${env.NODE_ENV} mode`);
    }
    console.error('❌ Failed to start server:');
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
  }
};

// Export the app and startServer for programmatic usage
export { startServer };
export default app;