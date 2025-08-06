// src/controller/product.controller.ts
import { Request, Response } from 'express';
import { productService } from '../services/product.service';
import { IProduct } from '../models/product.model';
import { Counter } from '../models/counter.model';

interface ProductDataForFrontend {
    id: string;
    name: string;
    image: string;
    rating: number;
    specs: string[];
    price: number;
    originalPrice?: number;
    currency: string;
    isOnSale: boolean;
    description?: string;
    stock?: number;
    category?: string;
}

export const getAllProducts = async (req: Request, res: Response) => {
    try {
        console.log('Fetching all products...');
        const products = await productService.getAllProducts();

        if (!Array.isArray(products)) {
            console.error('Expected products to be an array, got:', typeof products);
            return res.status(500).json({
                success: false,
                message: 'Invalid products data received from service'
            });
        }

        console.log(`Found ${products.length} products`);

        const transformedProducts: ProductDataForFrontend[] = products
            .filter(p => {
                const isValid = p && p._id != null;
                if (!isValid) {
                    console.warn('Skipping invalid product:', p);
                }
                return isValid;
            })
            .map(p => ({
                id: p._id?.toString() || 'unknown',
                name: p.name || 'Unnamed Product',
                image: p.imageUrl || '/placeholder.svg',
                rating: p.rating ?? 0,
                specs: Array.isArray(p.specs) ? p.specs : [],
                price: p.price ?? 0,
                originalPrice: p.originalPrice,
                currency: p.currency || 'LKR',
                isOnSale: Boolean(p.isOnSale),
                description: p.description ?? '',
                stock: p.stock ?? 0,
                category: p.category || 'Uncategorized'
            }));

        console.log(`Successfully transformed ${transformedProducts.length} products`);

        res.json({
            success: true,
            count: transformedProducts.length,
            data: transformedProducts
        });
    } catch (error) {
        console.error('Error in getAllProducts controller:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching products',
            error: process.env.NODE_ENV === 'development' ? (error as Error).message : undefined
        });
    }
};

export const getProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const product = await productService.getProductById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const transformedProduct: ProductDataForFrontend = {
            id: product._id.toString(),
            name: product.name,
            image: product.imageUrl || '/placeholder.svg',
            rating: product.rating !== undefined ? product.rating : 0,
            specs: product.specs || [],
            price: product.price,
            originalPrice: product.originalPrice,
            currency: product.currency || "LKR",
            isOnSale: product.isOnSale !== undefined ? product.isOnSale : false,
            description: product.description,
            stock: product.stock,
            category: product.category,
        };

        res.status(200).json(transformedProduct);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: 'Error fetching product', error: error instanceof Error ? error.message : 'Unknown error' });
    }
};

export const saveProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price, stock, category, imageUrl, rating, specs, currency, isOnSale, originalPrice } = req.body;

        if (!name || !description || price === undefined || !category) {
            return res.status(400).json({
                message: 'Missing required fields',
                required: ['name', 'description', 'price', 'category']
            });
        }

        const productData: Partial<IProduct> = {
            name: String(name),
            description: String(description),
            price: parseFloat(String(price)),
            stock: stock ? parseInt(String(stock), 10) : 0,
            category: String(category),
            imageUrl: imageUrl ? String(imageUrl) : undefined,
            rating: rating !== undefined ? parseFloat(String(rating)) : undefined,
            specs: specs && Array.isArray(specs) ? specs.map(String) : undefined,
            currency: currency ? String(currency) : undefined,
            isOnSale: isOnSale !== undefined ? Boolean(isOnSale) : undefined,
            originalPrice: originalPrice !== undefined ? parseFloat(String(originalPrice)) : undefined,
        };

        const newProduct = await productService.createProduct(productData as any);

        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: 'Error creating product', error: error instanceof Error ? error.message : 'Unknown error' });
    }
};

export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const { name, description, price, stock, category, imageUrl, rating, specs, currency, isOnSale, originalPrice } = req.body;

        const updateData: Partial<IProduct> = {};

        if (name !== undefined) updateData.name = String(name);
        if (description !== undefined) updateData.description = String(description);
        if (price !== undefined) updateData.price = parseFloat(String(price));
        if (stock !== undefined) updateData.stock = parseInt(String(stock), 10);
        if (category !== undefined) updateData.category = String(category);
        if (imageUrl !== undefined) updateData.imageUrl = String(imageUrl);
        if (rating !== undefined) updateData.rating = parseFloat(String(rating));
        if (specs !== undefined && Array.isArray(specs)) updateData.specs = specs.map(String);
        if (currency !== undefined) updateData.currency = String(currency);
        if (isOnSale !== undefined) updateData.isOnSale = Boolean(isOnSale);
        if (originalPrice !== undefined) updateData.originalPrice = parseFloat(String(originalPrice));

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: 'No valid fields to update' });
        }

        const updatedProduct = await productService.updateProduct(id, updateData);

        if (!updatedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: 'Error updating product', error: error instanceof Error ? error.message : 'Unknown error' });
    }
};

export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: 'Product ID is required' });
        }

        const isDeleted = await productService.deleteProduct(id);

        if (!isDeleted) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: 'Error deleting product', error: error instanceof Error ? error.message : 'Unknown error' });
    }
};

export const searchProducts = async (req: Request, res: Response) => {
    try {
        const { q } = req.query;

        if (!q || typeof q !== 'string') {
            return res.status(400).json({ message: 'Search query is required' });
        }

        const results = await productService.searchProducts(q);
        res.status(200).json(results);
    } catch (error) {
        console.error('Error searching products:', error);
        res.status(500).json({ message: 'Error searching products', error: error instanceof Error ? error.message : 'Unknown error' });
    }
};

export const resetProductCounter = async (req: Request, res: Response) => {
    try {
        await Counter.deleteOne({ _id: 'productId' });
        res.status(200).json({ message: 'Product counter reset successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to reset product counter', error });
    }
};