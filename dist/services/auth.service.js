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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyAccessToken = exports.revokeRefreshToken = exports.refreshAccessToken = exports.authenticateUser = exports.refreshTokens = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const user_model_1 = __importDefault(require("../models/user.model"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-secret';
// In-memory store for refresh tokens (in production, use a database)
exports.refreshTokens = new Set();
const authenticateUser = (email, inputPassword) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Find user by email in the database
        const existingUser = yield user_model_1.default.findOne({ email });
        if (!existingUser) {
            return null;
        }
        // Check if password is valid
        const isValidPassword = yield existingUser.comparePassword(inputPassword);
        if (!isValidPassword) {
            return null;
        }
        // Generate tokens
        const accessToken = jsonwebtoken_1.default.sign({
            userId: existingUser._id,
            email: existingUser.email,
            role: existingUser.role
        }, JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jsonwebtoken_1.default.sign({
            userId: existingUser._id,
            email: existingUser.email,
            role: existingUser.role
        }, REFRESH_SECRET, { expiresIn: '7d' });
        // Store refresh token (in production, store in a database with expiry)
        exports.refreshTokens.add(refreshToken);
        // Return user data without sensitive information
        const _a = existingUser.toObject(), { password: _, refreshToken: __ } = _a, userData = __rest(_a, ["password", "refreshToken"]);
        return {
            accessToken,
            refreshToken,
            user: userData
        };
    }
    catch (error) {
        console.error('Authentication error:', error);
        throw new Error('Authentication failed');
    }
});
exports.authenticateUser = authenticateUser;
const refreshAccessToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        if (!exports.refreshTokens.has(refreshToken)) {
            throw new Error('Invalid refresh token');
        }
        // Verify the refresh token
        const decoded = jsonwebtoken_1.default.verify(refreshToken, REFRESH_SECRET);
        // Find the user in the database
        const user = yield user_model_1.default.findById(decoded.userId);
        if (!user) {
            throw new Error('User not found');
        }
        // Generate new access token
        const accessToken = jsonwebtoken_1.default.sign({
            userId: user._id,
            email: user.email,
            role: user.role
        }, JWT_SECRET, { expiresIn: '15m' });
        // Generate new refresh token
        const newRefreshToken = jsonwebtoken_1.default.sign({
            userId: user._id,
            email: user.email,
            role: user.role
        }, REFRESH_SECRET, { expiresIn: '7d' });
        // Remove old refresh token and add new one
        exports.refreshTokens.delete(refreshToken);
        exports.refreshTokens.add(newRefreshToken);
        // Update user's refresh token in the database (if you're storing it there)
        // user.refreshToken = newRefreshToken;
        // await user.save();
        return {
            accessToken,
            refreshToken: newRefreshToken
        };
    }
    catch (error) {
        console.error('Refresh token error:', error);
        throw new Error('Failed to refresh token');
    }
});
exports.refreshAccessToken = refreshAccessToken;
const revokeRefreshToken = (refreshToken) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return exports.refreshTokens.delete(refreshToken);
    }
    catch (error) {
        console.error('Error revoking refresh token:', error);
        return false;
    }
});
exports.revokeRefreshToken = revokeRefreshToken;
const verifyAccessToken = (token) => {
    try {
        return jsonwebtoken_1.default.verify(token, JWT_SECRET);
    }
    catch (error) {
        if (error instanceof Error) {
            if (error.name === 'TokenExpiredError') {
                throw new Error('Token has expired');
            }
            else if (error.name === 'JsonWebTokenError') {
                throw new Error('Invalid token');
            }
        }
        console.error('Token verification error:', error);
        throw new Error('Failed to verify token');
    }
};
exports.verifyAccessToken = verifyAccessToken;
