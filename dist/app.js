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
exports.startServer = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = require("dotenv");
const mongoose_1 = __importDefault(require("mongoose"));
const DBConnection_1 = __importDefault(require("./db/DBConnection"));
const env_config_1 = require("./config/env.config");
const error_middleware_1 = require("./middleware/error.middleware");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const order_routes_1 = __importDefault(require("./routes/order.routes"));
const auth_middleware_1 = require("./middleware/auth.middleware");
// Load environment variables
(0, dotenv_1.config)();
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// CORS Configuration
app.use((0, cors_1.default)({
    origin: ['http://localhost:5173'],
    credentials: true
}));
// Health check endpoint with DB status
app.get('/api/health', (req, res) => {
    var _a;
    const dbStatus = mongoose_1.default.connection.readyState;
    let dbStatusText = '';
    switch (dbStatus) {
        case 0:
            dbStatusText = 'disconnected';
            break;
        case 1:
            dbStatusText = 'connected';
            break;
        case 2:
            dbStatusText = 'connecting';
            break;
        case 3:
            dbStatusText = 'disconnecting';
            break;
        default: dbStatusText = 'unknown';
    }
    res.status(200).json({
        status: 'ok',
        timestamp: new Date(),
        database: {
            status: dbStatusText,
            connection: process.env.MONGO_URI ? 'Configured' : 'Not configured',
            dbName: ((_a = mongoose_1.default.connection.db) === null || _a === void 0 ? void 0 : _a.databaseName) || 'Not connected'
        }
    });
});
// API Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/users', user_routes_1.default);
app.use('/api/products', product_routes_1.default);
app.use('/api/orders', auth_middleware_1.authenticateToken, order_routes_1.default);
// 404 Handler
app.use(error_middleware_1.notFound);
// Error Handler
app.use(error_middleware_1.errorHandler);
// Use port from environment configuration
const PORT = env_config_1.env.PORT;
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Connect to database
        try {
            yield (0, DBConnection_1.default)();
        }
        catch (dbError) {
            console.error('❌ Failed to connect to database:', dbError instanceof Error ? dbError.message : 'Unknown error');
            process.exit(1);
        }
        // Start the server
        const server = app.listen(PORT, () => {
            console.log(`\n🚀 Server running on http://localhost:${PORT}`);
            console.log(`Health check: http://localhost:${PORT}/api/health\n`);
        });
        // Handle server errors
        server.on('error', (error) => {
            if (error.syscall !== 'listen')
                throw error;
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
    }
    catch (error) {
        if (env_config_1.env.NODE_ENV === 'development') {
            console.log(`🚀 Starting in ${env_config_1.env.NODE_ENV} mode`);
        }
        console.error('❌ Failed to start server:');
        console.error(error instanceof Error ? error.message : error);
        process.exit(1);
    }
});
exports.startServer = startServer;
exports.default = app;
