"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("../controller/order.controller");
const orderRouter = (0, express_1.Router)();
orderRouter.post('/save-order', order_controller_1.createOrder);
orderRouter.get('/get-all-orders', order_controller_1.getAllOrders);
orderRouter.get('/:id', order_controller_1.getOrderById);
orderRouter.put('/update-order/:id', order_controller_1.updateOrderStatus);
orderRouter.get('/orders/user/:userId', order_controller_1.getOrdersByUserId);
orderRouter.delete('/delete-order/:id', order_controller_1.deleteOrder);
exports.default = orderRouter;
