"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Access the secret key defined in .env file
const JWT_SECRET = process.env.JWT_SECRET;
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Expected format: "Bearer <token>"
    if (!token) {
        res.status(401).json({ error: "Auth token is not present in request headers!" });
        return;
    }
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            res.status(401).json({ error: "Invalid or expired auth token provided!" });
            return;
        }
        req.user = user; // Store decoded user info
        next(); // Here next is a callback function provided by express.js used to pass control to the next middleware function in the stack
    });
};
exports.authenticateToken = authenticateToken;
