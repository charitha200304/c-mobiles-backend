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
exports.searchProducts = exports.deleteProduct = exports.updateProduct = exports.saveProduct = exports.getProduct = exports.getAllProducts = void 0;
const product_service_1 = require("../services/product.service");
// Get all products
const getAllProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield product_service_1.productService.getAllProducts();
        res.status(200).json(products);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching products', error: error instanceof Error ? error.message : 'Unknown error' });
    }
});
exports.getAllProducts = getAllProducts;
// Get single product
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Product ID is required' });
        }
        const product = yield product_service_1.productService.getProductById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(product);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching product', error: error instanceof Error ? error.message : 'Unknown error' });
    }
});
exports.getProduct = getProduct;
// Create new product
const saveProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, description, price, stock, category, imageUrl } = req.body;
        // Basic validation
        if (!name || !description || price === undefined || !category) {
            return res.status(400).json({
                message: 'Missing required fields',
                required: ['name', 'description', 'price', 'category']
            });
        }
        // Create a plain object that matches the expected type
        const productData = {
            name: String(name),
            description: String(description),
            price: parseFloat(String(price)),
            stock: stock ? parseInt(String(stock), 10) : 0,
            category: String(category),
            imageUrl: imageUrl ? String(imageUrl) : ''
        };
        const newProduct = yield product_service_1.productService.createProduct(productData);
        res.status(201).json(newProduct);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating product', error: error instanceof Error ? error.message : 'Unknown error' });
    }
});
exports.saveProduct = saveProduct;
// Update product
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Product ID is required' });
        }
        const { name, description, price, stock, category, imageUrl } = req.body;
        // Create a plain object with only the provided fields
        const updateData = {};
        if (name !== undefined)
            updateData.name = String(name);
        if (description !== undefined)
            updateData.description = String(description);
        if (price !== undefined)
            updateData.price = parseFloat(String(price));
        if (stock !== undefined)
            updateData.stock = parseInt(String(stock), 10);
        if (category !== undefined)
            updateData.category = String(category);
        if (imageUrl !== undefined)
            updateData.imageUrl = String(imageUrl);
        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'No valid fields to update' });
        }
        const updatedProduct = yield product_service_1.productService.updateProduct(id, updateData);
        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json(updatedProduct);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating product', error: error instanceof Error ? error.message : 'Unknown error' });
    }
});
exports.updateProduct = updateProduct;
// Delete product
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Product ID is required' });
        }
        const isDeleted = yield product_service_1.productService.deleteProduct(id);
        if (!isDeleted) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting product', error: error instanceof Error ? error.message : 'Unknown error' });
    }
});
exports.deleteProduct = deleteProduct;
// Search products
const searchProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { q } = req.query;
        if (!q || typeof q !== 'string') {
            return res.status(400).json({ message: 'Search query is required' });
        }
        const results = yield product_service_1.productService.searchProducts(q);
        res.status(200).json(results);
    }
    catch (error) {
        res.status(500).json({ message: 'Error searching products', error: error instanceof Error ? error.message : 'Unknown error' });
    }
});
exports.searchProducts = searchProducts;
