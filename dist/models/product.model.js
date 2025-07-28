"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
// Create the schema
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    category: {
        type: String,
        required: true
    },
    imageUrl: {
        type: String,
        required: false
    }
}, {
    timestamps: true
});
// Create and export the Product model
exports.Product = (0, mongoose_1.model)('Product', productSchema);
