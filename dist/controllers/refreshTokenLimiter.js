"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshTokenLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.refreshTokenLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 requests per windowMs
    handler: (req, res) => {
        res.status(429).json({
            error: 'Refresh token limit exceeded. Please login again.',
            code: 'RATE_LIMIT_EXCEEDED'
        });
    },
    standardHeaders: false, // Don't show retry headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
