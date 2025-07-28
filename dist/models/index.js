"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Order = exports.Product = exports.User = void 0;
// User
var user_model_1 = require("./user.model");
Object.defineProperty(exports, "User", { enumerable: true, get: function () { return __importDefault(user_model_1).default; } });
// Product
var product_model_1 = require("./product.model");
Object.defineProperty(exports, "Product", { enumerable: true, get: function () { return product_model_1.Product; } });
// Order
var order_model_1 = require("./order.model");
Object.defineProperty(exports, "Order", { enumerable: true, get: function () { return order_model_1.Order; } });
