"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = exports.logout = exports.refreshToken = exports.login = void 0;
const authService = __importStar(require("../services/auth.service"));
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }
        const tokens = yield authService.authenticateUser(email, password);
        if (!tokens) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        res.status(200).json({
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken
        });
    }
    catch (error) {
        console.error('Login error:', error);
        const message = error instanceof Error ? error.message : "An unknown error occurred";
        res.status(500).json({ message });
    }
});
exports.login = login;
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token is required" });
        }
        const newTokens = yield authService.refreshAccessToken(refreshToken);
        if (!newTokens) {
            return res.status(401).json({ message: "Invalid refresh token" });
        }
        res.status(200).json(newTokens);
    }
    catch (error) {
        console.error('Refresh token error:', error);
        const message = error instanceof Error ? error.message : "Failed to refresh token";
        res.status(500).json({ message });
    }
});
exports.refreshToken = refreshToken;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) {
            return res.status(400).json({ message: "Refresh token is required" });
        }
        yield authService.revokeRefreshToken(refreshToken);
        res.status(200).json({ message: "Successfully logged out" });
    }
    catch (error) {
        console.error('Logout error:', error);
        const message = error instanceof Error ? error.message : "Failed to logout";
        res.status(500).json({ message });
    }
});
exports.logout = logout;
exports.authController = {
    login: exports.login,
    refreshToken: exports.refreshToken,
    logout: exports.logout
};
