"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
// Load environment variables from .env file
dotenv_1.default.config();
// Validate required environment variables
const requiredVars = [
    'JWT_SECRET',
    'JWT_REFRESH_SECRET',
    'CORS_ORIGIN'
];
// Check for missing required environment variables
const missingVars = requiredVars.filter(varName => !process.env[varName]);
if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}
// Export environment variables with type safety
exports.env = {
    // Server
    PORT: parseInt(process.env.PORT || '3002', 10),
    NODE_ENV: process.env.NODE_ENV || 'development',
    // JWT
    JWT_SECRET: process.env.JWT_SECRET,
    JWT_EXPIRE: process.env.JWT_EXPIRE || '15m',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRE: process.env.JWT_REFRESH_EXPIRE || '7d',
    // Security
    PASSWORD_SALT_ROUNDS: parseInt(process.env.PASSWORD_SALT_ROUNDS || '10', 10),
    // CORS
    CORS_ORIGIN: process.env.CORS_ORIGIN,
};
// Only log environment info in development
if (exports.env.NODE_ENV === 'development') {
    console.log(`🌱 Environment: ${exports.env.NODE_ENV}`);
}
