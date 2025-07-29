import mongoose, { ConnectOptions } from 'mongoose';
import { config } from 'dotenv';

config(); // Ensure dotenv config is called so env variables are loaded

// Define a custom error interface that includes codeName
interface MongoError extends Error {
    codeName?: string;
    code?: number | string;
}

// CORRECTED: Use process.env.MONGODB_URI as defined in your .env file
const DB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/Cmobiles';

// Event listeners for connection status
mongoose.connection.on('connected', () => {
    if (mongoose.connection.db) {
        console.log(`✅ MongoDB connected to database: ${mongoose.connection.db.databaseName}`);
    } else {
        console.log('✅ MongoDB connected');
    }
});

mongoose.connection.on('error', (error) => {
    console.error('❌ MongoDB connection error:', error.message);
});

const connectDB = async (): Promise<string> => {
    try {
        if (!DB_URI) {
            throw new Error('MongoDB connection string is not defined in environment variables');
        }

        // Only log the masked connection string once
        if (!process.env.DB_CONNECTION_LOGGED) {
            const maskedUri = DB_URI.replace(/:[^:]+@/, ':***@');
            console.log(`🔌 Connecting to MongoDB at ${maskedUri}...`);
            process.env.DB_CONNECTION_LOGGED = 'true';
        }

        // Connect to MongoDB with options
        const options: ConnectOptions = {
            serverSelectionTimeoutMS: 10000, // 10 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4, // Use IPv4, skip trying IPv6
            retryWrites: true,
            w: 'majority'
        };

        await mongoose.connect(DB_URI, options);

        // Get the database instance
        const db = mongoose.connection.db;
        if (!db) {
            throw new Error('Failed to get database instance');
        }

        // --- START OF CODE TO COMMENT OUT/REMOVE ---
        // This block explicitly drops and recreates the users collection.
        // It should generally be REMOVED or COMMENTED OUT for production/persistent development.
        /*
        try {
            // Drop the users collection to remove all indexes
            await db.collection('users').drop();
            console.log('Dropped users collection to reset all indexes');
        } catch (error: unknown) {
            const mongoError = error as MongoError;
            if (mongoError.codeName === 'NamespaceNotFound') {
                console.log('Users collection does not exist, creating a fresh one');
            } else {
                console.error('Error dropping users collection:', error);
                throw error;
            }
        }

        // Recreate the collection (this might not be needed if not dropped)
        // await db.createCollection('users'); // Uncomment only if you need to ensure collection exists on first run
        // console.log('Created fresh users collection'); // Corresponding log

        // Rebuild indexes based on the current schema (this is generally okay to keep if needed for schema changes)
        // await mongoose.connection.syncIndexes();
        // console.log('Recreated indexes based on current schema');
        */
        // --- END OF CODE TO COMMENT OUT/REMOVE ---

        // It's generally good practice to sync indexes, but outside of the drop/recreate block
        // You might want to keep syncIndexes() if your schema changes in dev:
        // await mongoose.connection.syncIndexes(); // Example: place this if you want indexes to always be up-to-date


        return `MongoDB connected successfully to database "${db.databaseName}"`;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
};

export default connectDB;