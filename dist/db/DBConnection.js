"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const DB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/Cmobiles';
// Event listeners for connection status
mongoose_1.default.connection.on('connected', () => {
    if (mongoose_1.default.connection.db) {
        console.log(`✅ MongoDB connected to database: ${mongoose_1.default.connection.db.databaseName}`);
    }
    else {
        console.log('✅ MongoDB connected');
    }
});
mongoose_1.default.connection.on('error', (error) => {
    console.error('❌ MongoDB connection error:', error.message);
});
const connectDB = () => __awaiter(void 0, void 0, void 0, function* () {
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
        const options = {
            serverSelectionTimeoutMS: 10000, // 10 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
            family: 4, // Use IPv4, skip trying IPv6
            retryWrites: true,
            w: 'majority'
        };
        yield mongoose_1.default.connect(DB_URI, options);
        // Get the database instance
        const db = mongoose_1.default.connection.db;
        if (!db) {
            throw new Error('Failed to get database instance');
        }
        try {
            // Drop the users collection to remove all indexes
            yield db.collection('users').drop();
            console.log('Dropped users collection to reset all indexes');
        }
        catch (error) {
            const mongoError = error;
            if (mongoError.codeName === 'NamespaceNotFound') {
                console.log('Users collection does not exist, creating a fresh one');
            }
            else {
                console.error('Error dropping users collection:', error);
                throw error;
            }
        }
        // Recreate the collection with the correct schema
        yield db.createCollection('users');
        console.log('Created fresh users collection');
        // Rebuild indexes based on the current schema
        yield mongoose_1.default.connection.syncIndexes();
        console.log('Recreated indexes based on current schema');
        return `MongoDB connected successfully to database "${db.databaseName}"`;
    }
    catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1);
    }
});
exports.default = connectDB;
