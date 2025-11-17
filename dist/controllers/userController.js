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
exports.logOut = exports.login = exports.signUp = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = require("../DB/user");
dotenv_1.default.config();
const SECRET = process.env.SECRET;
if (!SECRET) {
    throw new Error('Secret not found');
}
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password, name, role } = req.body;
        if (!email || !password || !name) {
            return res.status(400).json({ error: 'field missing' });
        }
        const checkExistingUser = yield user_1.User.findOne({ email });
        if (checkExistingUser) {
            return res
                .status(400)
                .json({ error: `user with the ${email} already exists` });
        }
        const hashPassword = yield bcrypt_1.default.hash(password, 12);
        const newUser = new user_1.User({ name, email, password: hashPassword, role });
        yield newUser.save();
        return res.status(200).json({ message: "You've successfully signed up" });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.signUp = signUp;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'One of the fields is missing' });
        }
        const foundUser = yield user_1.User.findOne({ email });
        if (!foundUser) {
            return res.status(400).json({ error: 'Inavlid email or password' });
        }
        const verifyPassword = yield bcrypt_1.default.compare(password, foundUser.password);
        if (!verifyPassword) {
            return res.status(400).json({ error: 'Email or password not correct' });
        }
        const { _id, role, name } = foundUser;
        const payload = { id: _id.toString(), role };
        const token = jsonwebtoken_1.default.sign(payload, SECRET, { expiresIn: '15m' });
        const refreshToken = jsonwebtoken_1.default.sign(payload, SECRET, { expiresIn: '7d' });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: '/api/refreshToken',
        });
        return res
            .status(200)
            .json({ login: true, role: role, id: _id.toString(), accessToken: token, username: name });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});
exports.login = login;
const logOut = (req, res) => {
    const token = req.cookies.token;
    token ? console.log("Here's Token :", token) : console.log("I can't find Token");
    try {
        if (!token)
            return res
                .status(401)
                .json({ message: 'Token not found. Please log in' });
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
        });
        return res.status(204).end();
    }
    catch (err) {
        console.log(err);
        return res.status(500).json({ message: 'Internal server error' });
    }
};
exports.logOut = logOut;
