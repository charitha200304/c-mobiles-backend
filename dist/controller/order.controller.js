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
exports.deleteOrder = exports.updateOrderStatus = exports.getOrdersByUserId = exports.getOrderById = exports.getAllOrders = exports.createOrder = void 0;
const order_model_1 = require("../models/order.model");
const order_service_1 = require("../services/order.service");
// Create a new order
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId, items, shippingAddress, paymentMethod } = req.body;
        if (!userId) {
            res.status(400).json({ message: 'User ID is required' });
            return;
        }
        if (!items || !Array.isArray(items) || items.length === 0) {
            res.status(400).json({ message: 'Order items are required' });
            return;
        }
        if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
            res.status(400).json({ message: 'Complete shipping address is required' });
            return;
        }
        if (!paymentMethod) {
            res.status(400).json({ message: 'Payment method is required' });
            return;
        }
        const { order, error } = yield order_service_1.orderService.createOrder(userId, items, shippingAddress, paymentMethod);
        if (error || !order) {
            res.status(400).json({
                success: false,
                message: error || 'Failed to create order'
            });
            return;
        }
        res.status(201).json({
            success: true,
            data: order
        });
    }
    catch (error) {
        console.error('Error in createOrder:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
exports.createOrder = createOrder;
// Get all orders
const getAllOrders = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orders = yield order_service_1.orderService.getAllOrders();
        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.getAllOrders = getAllOrders;
// Get order by ID
const getOrderById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.id;
        if (!orderId) {
            res.status(400).json({ success: false, message: 'Order ID is required' });
            return;
        }
        const order = yield order_service_1.orderService.getOrderById(orderId);
        if (!order) {
            res.status(404).json({ success: false, message: 'Order not found' });
            return;
        }
        res.status(200).json({
            success: true,
            data: order
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching order',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.getOrderById = getOrderById;
// Get orders by user ID
const getOrdersByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        if (!userId) {
            res.status(400).json({ success: false, message: 'User ID is required' });
            return;
        }
        const orders = yield order_service_1.orderService.getOrdersByUserId(userId);
        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error fetching orders',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.getOrdersByUserId = getOrdersByUserId;
// Update order status
const updateOrderStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.id;
        if (!orderId) {
            res.status(400).json({ success: false, message: 'Order ID is required' });
            return;
        }
        const { status } = req.body;
        if (!status || !['pending', 'processing', 'completed', 'cancelled'].includes(status)) {
            res.status(400).json({ success: false, message: 'Valid status is required (pending, processing, completed, cancelled)' });
            return;
        }
        // First get the order
        const order = yield order_model_1.Order.findById(orderId);
        if (!order) {
            res.status(404).json({ success: false, message: 'Order not found' });
            return;
        }
        // Update the status
        order.status = status;
        const updatedOrder = yield order.save();
        res.status(200).json({
            success: true,
            data: updatedOrder
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error updating order status',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.updateOrderStatus = updateOrderStatus;
// Delete order
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderId = req.params.id;
        if (!orderId) {
            res.status(400).json({ success: false, message: 'Order ID is required' });
            return;
        }
        // Check if order exists and delete it
        const deletedOrder = yield order_model_1.Order.findByIdAndDelete(orderId);
        if (!deletedOrder) {
            res.status(404).json({ success: false, message: 'Order not found' });
            return;
        }
        res.status(200).json({
            success: true,
            message: 'Order deleted successfully'
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error deleting order',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});
exports.deleteOrder = deleteOrder;
