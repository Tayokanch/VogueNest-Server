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
exports.refreshToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_1 = require("../DB/user");
const SECRET = process.env.SECRET;
if (!SECRET) {
    throw new Error('Secret not found');
}
const refreshToken = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ error: 'No refresh token found' });
        }
        const decoded = jsonwebtoken_1.default.verify(refreshToken, SECRET);
        if (decoded.exp && decoded.exp < Date.now() / 1000) {
            return res.status(401).json({ error: 'Refresh token expired' });
        }
        const user = yield user_1.User.findOne({ _id: decoded.id });
        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }
        const { _id, role } = user;
        const payload = { id: _id.toString(), role };
        const accessToken = jsonwebtoken_1.default.sign(payload, SECRET, { expiresIn: '15m' });
        const newRefreshToken = jsonwebtoken_1.default.sign(payload, SECRET, { expiresIn: '7d' });
        res.cookie('refreshToken', newRefreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });
        return res.status(200).json({ accessToken });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.refreshToken = refreshToken;
