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
exports.makePayment = void 0;
const stripe = require("stripe")(process.env.STRIPE_SECRET);
const makePayment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { products } = req.body;
        if (!products || products.length === 0) {
            return res.status(400).json({ error: 'No products provided.' });
        }
        const lineItems = products.map((product) => ({
            price_data: {
                currency: "gbp",
                product_data: {
                    name: product.name,
                    images: product.image,
                },
                unit_amount: Math.round(product.price * 100),
            },
            quantity: product.quantity,
        }));
        const session = yield stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: "https://voguenestt.netlify.app/success",
            cancel_url: "https://voguenestt.netlify.app/cancel"
        });
        return res.status(200).json({ id: session.id });
    }
    catch (error) {
        console.error('Error creating checkout session:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.makePayment = makePayment;
