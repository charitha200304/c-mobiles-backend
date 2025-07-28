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
Object.defineProperty(exports, "__esModule", { value: true });
exports.productService = void 0;
const product_model_1 = require("../models/product.model");
class ProductService {
    /**
     * Get all products with optional filtering
     */
    getAllProducts() {
        return __awaiter(this, arguments, void 0, function* (filter = {}) {
            try {
                return yield product_model_1.Product.find(filter).sort({ createdAt: -1 });
            }
            catch (error) {
                throw new Error('Error fetching products');
            }
        });
    }
    /**
     * Get a single product by ID
     */
    getProductById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield product_model_1.Product.findById(id);
            }
            catch (error) {
                throw new Error('Product not found');
            }
        });
    }
    /**
     * Create a new product
     */
    createProduct(productData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const product = new product_model_1.Product(productData);
                return yield product.save();
            }
            catch (error) {
                throw new Error('Error creating product');
            }
        });
    }
    /**
     * Update an existing product
     */
    updateProduct(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield product_model_1.Product.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
            }
            catch (error) {
                throw new Error('Error updating product');
            }
        });
    }
    /**
     * Delete a product
     */
    deleteProduct(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield product_model_1.Product.findByIdAndDelete(id);
                return result !== null;
            }
            catch (error) {
                throw new Error('Error deleting product');
            }
        });
    }
    /**
     * Search products by name or description
     */
    searchProducts(query) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield product_model_1.Product.find({
                    $or: [
                        { name: { $regex: query, $options: 'i' } },
                        { description: { $regex: query, $options: 'i' } }
                    ]
                });
            }
            catch (error) {
                throw new Error('Error searching products');
            }
        });
    }
}
// Export a singleton instance
exports.productService = new ProductService();
