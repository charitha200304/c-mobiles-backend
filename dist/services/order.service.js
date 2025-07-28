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
exports.orderService = void 0;
const order_model_1 = require("../models/order.model");
const product_model_1 = require("../models/product.model");
class OrderService {
    /**
     * Create a new order and update product stock
     */
    createOrder(userId, items, shippingAddress, paymentMethod) {
        return __awaiter(this, void 0, void 0, function* () {
            const session = yield order_model_1.Order.startSession();
            session.startTransaction();
            try {
                // 1. Validate all items and check stock
                const orderItems = [];
                let itemsPrice = 0;
                for (const item of items) {
                    const product = yield product_model_1.Product.findById(item.product).session(session);
                    if (!product) {
                        yield session.abortTransaction();
                        return {
                            order: null,
                            error: `Product with ID ${item.product} not found`
                        };
                    }
                    if (product.stock < item.quantity) {
                        yield session.abortTransaction();
                        return {
                            order: null,
                            error: `Insufficient stock for product ${product.name}. Available: ${product.stock}`
                        };
                    }
                    // Add to order items with proper type casting
                    const orderItem = {
                        product: product._id, // Cast to ObjectId
                        name: product.name,
                        quantity: item.quantity,
                        price: product.price,
                        image: product.imageUrl || ''
                    };
                    orderItems.push(orderItem);
                    itemsPrice += product.price * item.quantity;
                    // Update product stock
                    product.stock -= item.quantity;
                    yield product.save({ session });
                }
                // 2. Calculate prices
                const taxPrice = Number((itemsPrice * 0.1).toFixed(2));
                const shippingPrice = itemsPrice > 100 ? 0 : 10;
                const totalPrice = itemsPrice + taxPrice + shippingPrice;
                // 3. Create the order
                const order = new order_model_1.Order({
                    user: userId,
                    orderItems,
                    shippingAddress,
                    paymentMethod,
                    itemsPrice,
                    taxPrice,
                    shippingPrice,
                    totalPrice,
                });
                const createdOrder = yield order.save({ session });
                yield session.commitTransaction();
                return {
                    order: yield createdOrder.populate('user', 'name email'),
                    error: null
                };
            }
            catch (error) {
                yield session.abortTransaction();
                console.error('Error creating order:', error);
                return {
                    order: null,
                    error: error.message || 'Error creating order'
                };
            }
            finally {
                yield session.endSession();
            }
        });
    }
    /**
     * Get order by ID
     */
    getOrderById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield order_model_1.Order.findById(id)
                    .populate('user', 'name email')
                    .populate({
                    path: 'orderItems.product',
                    select: 'name imageUrl'
                });
            }
            catch (error) {
                throw new Error('Error fetching order');
            }
        });
    }
    /**
     * Get orders by user ID
     */
    getOrdersByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield order_model_1.Order.find({ user: userId })
                    .sort({ createdAt: -1 })
                    .populate({
                    path: 'orderItems.product',
                    select: 'name imageUrl'
                });
            }
            catch (error) {
                throw new Error('Error fetching user orders');
            }
        });
    }
    /**
     * Get all orders (admin only)
     */
    getAllOrders() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield order_model_1.Order.find({})
                    .populate('user', 'id name')
                    .sort({ createdAt: -1 });
            }
            catch (error) {
                throw new Error('Error fetching all orders');
            }
        });
    }
    /**
     * Update order to paid
     */
    updateOrderToPaid(orderId, paymentResult) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield order_model_1.Order.findById(orderId);
                if (order) {
                    order.isPaid = true;
                    order.paidAt = new Date();
                    order.paymentResult = paymentResult;
                    const updatedOrder = yield order.save();
                    return updatedOrder;
                }
                return null;
            }
            catch (error) {
                throw new Error('Error updating order to paid');
            }
        });
    }
    /**
     * Update order to delivered (admin only)
     */
    updateOrderToDelivered(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield order_model_1.Order.findById(orderId);
                if (order) {
                    order.isDelivered = true;
                    order.deliveredAt = new Date();
                    const updatedOrder = yield order.save();
                    return updatedOrder;
                }
                return null;
            }
            catch (error) {
                throw new Error('Error updating order to delivered');
            }
        });
    }
    /**
     * Delete order (admin only)
     */
    deleteOrder(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield order_model_1.Order.findByIdAndDelete(orderId);
                return result !== null;
            }
            catch (error) {
                throw new Error('Error deleting order');
            }
        });
    }
}
// Export a singleton instance
exports.orderService = new OrderService();
