"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderItemSchema = new mongoose_1.default.Schema({
    productId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
    },
    size: {
        type: String,
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
});
const orderSchema = new mongoose_1.default.Schema({
    customerId: {
        type: String,
        required: true,
    },
    orders: {
        type: [orderItemSchema],
        required: true,
    },
    deliveryStatus: {
        type: String,
        enum: ['processing', 'packing', 'out for delivery', 'delivered'], // Valid values
        default: 'processing',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const Order = mongoose_1.default.model('Order', orderSchema);
exports.default = Order;
