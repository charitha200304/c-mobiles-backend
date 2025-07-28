"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// index.ts
const app_1 = require("./app");
// Start the server with database connection
(0, app_1.startServer)().catch(error => {
    console.error('Failed to start server:', error);
    process.exit(1);
});
