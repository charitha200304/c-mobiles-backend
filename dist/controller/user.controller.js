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
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchUser = exports.deleteUser = exports.updateUser = exports.saveUser = exports.getUser = exports.getAllUsers = void 0;
const services_1 = require("../services");
/**
 * Get all users
 */
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield services_1.userService.getAllUsers();
        const response = {
            success: true,
            message: 'Users retrieved successfully',
            data: users
        };
        res.status(200).json(response);
    }
    catch (error) {
        const response = {
            success: false,
            message: 'Error retrieving users',
            error: error.message
        };
        res.status(500).json(response);
    }
});
exports.getAllUsers = getAllUsers;
/**
 * Get user by ID
 */
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.params.id;
        const user = yield services_1.userService.findUserById(userId);
        if (!user) {
            const response = {
                success: false,
                message: 'User not found'
            };
            res.status(404).json(response);
            return;
        }
        const response = {
            success: true,
            message: 'User retrieved successfully',
            data: user
        };
        res.status(200).json(response);
    }
    catch (error) {
        const response = {
            success: false,
            message: 'Error retrieving user',
            error: error.message
        };
        res.status(500).json(response);
    }
});
exports.getUser = getUser;
/**
 * Create a new user
 */
const saveUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, phone, address, role } = req.body;
        // Basic validation
        if (!name || !email || !password) {
            res.status(400).json({
                success: false,
                message: 'Name, email, and password are required'
            });
            return;
        }
        // Prepare user data
        const userData = {
            name,
            email,
            password,
            phone: phone ? phone.toString() : '',
            address: address || '',
            role: role || 'customer'
        };
        const user = yield services_1.userService.createUser(userData);
        // Remove sensitive data before sending response
        const _a = user.toObject(), { password: _, refreshToken } = _a, userWithoutSensitiveData = __rest(_a, ["password", "refreshToken"]);
        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: userWithoutSensitiveData
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            message: 'Error creating user',
            error: error.message
        });
    }
});
exports.saveUser = saveUser;
/**
 * Update an existing user
 */
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
            return;
        }
        const { name, email, password, phone, address, role } = req.body;
        const updateData = {};
        // Only include fields that are provided in the request
        if (name)
            updateData.name = name;
        if (email)
            updateData.email = email;
        if (password)
            updateData.password = password;
        if (phone !== undefined)
            updateData.phone = phone.toString();
        if (address !== undefined)
            updateData.address = address;
        if (role)
            updateData.role = role;
        const updatedUser = yield services_1.userService.updateUser(id, updateData);
        if (!updatedUser) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser
        });
    }
    catch (error) {
        console.error('Error updating user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.updateUser = updateUser;
/**
 * Delete a user
 */
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            res.status(400).json({
                success: false,
                message: 'User ID is required'
            });
            return;
        }
        const result = yield services_1.userService.deleteUser(id);
        if (!result) {
            res.status(404).json({
                success: false,
                message: 'User not found'
            });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    }
    catch (error) {
        console.error('Error deleting user:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete user',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.deleteUser = deleteUser;
/**
 * Search users by name or email
 */
const searchUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { q } = req.query;
        if (!q || typeof q !== 'string') {
            const response = {
                success: false,
                message: 'Search query is required'
            };
            res.status(400).json(response);
            return;
        }
        // Use the searchUsers method from the user service
        const users = yield services_1.userService.searchUsers(q);
        const response = {
            success: true,
            message: 'Users retrieved successfully',
            data: users
        };
        res.status(200).json(response);
    }
    catch (error) {
        const response = {
            success: false,
            message: 'Error searching users',
            error: error.message
        };
        res.status(500).json(response);
    }
});
exports.searchUser = searchUser;
