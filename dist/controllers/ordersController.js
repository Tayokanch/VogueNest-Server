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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserOrder = exports.postOrder = void 0;
const order_1 = __importDefault(require("../DB/order"));
const postOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const customerId = (_a = req.decodedUser) === null || _a === void 0 ? void 0 : _a.id;
        if (!customerId) {
            throw new Error('CustomerId not found');
            return;
        }
        const { orders } = req.body;
        if (!orders || orders.length === 0) {
            return res.status(404).json({ message: 'Order items are required' });
        }
        for (const item of orders) {
            const { productId, size, quantity } = item;
            if (!productId || !size || !quantity) {
                return res.status(404).json({
                    message: 'Each order item must inlcude productId, size, quantity',
                });
            }
        }
        const newOrder = yield new order_1.default({
            customerId: customerId,
            orders: orders.map((item) => ({
                productId: item.productId,
                size: item.size,
                quantity: item.quantity,
            })),
        });
        yield newOrder.save();
        return res.status(201).json({ message: 'Order processed' });
    }
    catch (err) {
        console.error("THis is the err", err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.postOrder = postOrder;
const getUserOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const customerId = (_a = req.decodedUser) === null || _a === void 0 ? void 0 : _a.id;
        if (!customerId) {
            return res.status(400).json({ message: 'customerId not found' });
        }
        const order = yield order_1.default.find({ customerId });
        if (!order || order.length === 0) {
            return res
                .status(404)
                .json({ message: 'No orders found for you' });
        }
        return res.status(200).json(order);
    }
    catch (error) {
        console.error(error);
        return res
            .status(500)
            .json({ error: 'Internal Server error' });
    }
});
exports.getUserOrder = getUserOrder;
