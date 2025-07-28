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
exports.userService = exports.UserService = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const mongoose_1 = require("mongoose");
const email_service_1 = require("./email.service");
class UserService {
    constructor() {
        // Email validation regex
        this.emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        // Password validation regex - at least 8 chars, 1 uppercase, 1 lowercase, 1 number
        this.passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    }
    /**
     * Validate user input
     */
    validateUserInput(userData) {
        const { name, email, password } = userData;
        const errors = [];
        if (!name || name.trim().length < 2) {
            errors.push('Name must be at least 2 characters long');
        }
        if (!email || !this.emailRegex.test(email)) {
            errors.push('Please enter a valid email address');
        }
        if (password && !this.passwordRegex.test(password)) {
            errors.push('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number');
        }
        return {
            isValid: errors.length === 0,
            errors
        };
    }
    /**
     * Create a new user
     */
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            // Validate input
            const { isValid, errors } = this.validateUserInput(userData);
            if (!isValid) {
                throw new Error(`Validation failed: ${errors.join(', ')}`);
            }
            try {
                // Check if user already exists
                const existingUser = yield user_model_1.default.findOne({ email: userData.email });
                if (existingUser) {
                    throw new Error('User with this email already exists');
                }
                // Create and save the user
                const user = new user_model_1.default({
                    name: userData.name,
                    email: userData.email,
                    password: userData.password,
                    role: userData.role || 'customer',
                    address: userData.address || '',
                    phone: userData.phone || ''
                });
                const savedUser = yield user.save();
                // Send welcome email (don't await to avoid blocking the response)
                email_service_1.emailService.sendWelcomeEmail(savedUser.email, savedUser.name)
                    .then(sent => {
                    if (!sent) {
                        console.error('Failed to send welcome email to:', savedUser.email);
                    }
                })
                    .catch(error => {
                    console.error('Error sending welcome email:', error);
                });
                return savedUser;
            }
            catch (error) {
                throw new Error(`Error creating user: ${error.message}`);
            }
        });
    }
    /**
     * Get all users (without sensitive data)
     */
    getAllUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield user_model_1.default.find({}, { password: 0, refreshToken: 0 });
                return users;
            }
            catch (error) {
                throw new Error(`Error retrieving users: ${error.message}`);
            }
        });
    }
    /**
     * Find user by ID (without sensitive data)
     */
    findUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongoose_1.Types.ObjectId.isValid(id)) {
                    throw new Error('Invalid user ID');
                }
                const user = yield user_model_1.default.findById(id, { password: 0, refreshToken: 0 });
                return user;
            }
            catch (error) {
                throw new Error(`Error finding user: ${error.message}`);
            }
        });
    }
    /**
     * Find user by email (with password, for login verification)
     */
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield user_model_1.default.findOne({ email });
            }
            catch (error) {
                throw new Error(`Error finding user by email: ${error.message}`);
            }
        });
    }
    /**
     * Update user
     */
    updateUser(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongoose_1.Types.ObjectId.isValid(id)) {
                    throw new Error('Invalid user ID');
                }
                // Don't allow updating password or refreshToken through this method
                const _a = updateData, { password, refreshToken } = _a, safeUpdateData = __rest(_a, ["password", "refreshToken"]);
                const updatedUser = yield user_model_1.default.findByIdAndUpdate(id, { $set: Object.assign(Object.assign({}, safeUpdateData), { updatedAt: new Date() }) }, { new: true, runValidators: true, projection: { password: 0, refreshToken: 0 } });
                return updatedUser;
            }
            catch (error) {
                throw new Error(`Error updating user: ${error.message}`);
            }
        });
    }
    /**
     * Delete user
     */
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongoose_1.Types.ObjectId.isValid(id)) {
                    throw new Error('Invalid user ID');
                }
                const result = yield user_model_1.default.findByIdAndDelete(id);
                return !!result;
            }
            catch (error) {
                throw new Error(`Error deleting user: ${error.message}`);
            }
        });
    }
    /**
     * Compare password
     */
    comparePassword(user, candidatePassword) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userDoc = yield user_model_1.default.findById(user._id).select('+password');
                if (!userDoc)
                    return false;
                return yield userDoc.comparePassword(candidatePassword);
            }
            catch (error) {
                throw new Error(`Error comparing passwords: ${error.message}`);
            }
        });
    }
    /**
     * Update refresh token
     */
    updateRefreshToken(userId, refreshToken) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!mongoose_1.Types.ObjectId.isValid(userId)) {
                    throw new Error('Invalid user ID');
                }
                yield user_model_1.default.findByIdAndUpdate(userId, { refreshToken }, { new: true });
            }
            catch (error) {
                throw new Error(`Error updating refresh token: ${error.message}`);
            }
        });
    }
    /**
     * Search users by name or email
     */
    searchUsers(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!query || query.trim().length < 2) {
                    throw new Error('Search query must be at least 2 characters long');
                }
                const searchRegex = new RegExp(query, 'i');
                const users = yield user_model_1.default.find({
                    $or: [
                        { name: { $regex: searchRegex } },
                        { email: { $regex: searchRegex } }
                    ]
                }, { password: 0, refreshToken: 0 });
                return users;
            }
            catch (error) {
                throw new Error(`Error searching users: ${error.message}`);
            }
        });
    }
}
exports.UserService = UserService;
// Export a singleton instance
exports.userService = new UserService();
