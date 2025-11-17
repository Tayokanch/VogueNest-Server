"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.middleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const SECRET = process.env.SECRET;
if (!SECRET) {
    throw new Error('Secret not found');
}
const middleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    try {
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                message: 'Access token required. Please log in',
            });
        }
        const accessToken = authHeader.split(' ')[1];
        jsonwebtoken_1.default.verify(accessToken, SECRET, (err, decodedUser) => {
            if (err) {
                return res.status(401).json({
                    message: 'Access token expired or invalid. Please refresh token'
                });
            }
            req.decodedUser = decodedUser;
            next();
        });
    }
    catch (err) {
        console.error(err);
        return next(err);
    }
};
exports.middleware = middleware;
