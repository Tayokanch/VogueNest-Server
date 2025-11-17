"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const compression_1 = __importDefault(require("compression"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRouter_1 = __importDefault(require("./routers/userRouter"));
const refreshTokenRouter_1 = __importDefault(require("./routers/refreshTokenRouter"));
const orderRouter_1 = __importDefault(require("./routers/orderRouter"));
const stripe_1 = __importDefault(require("./routers/stripe"));
const refreshTokenLimiter_1 = require("./controllers/refreshTokenLimiter");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: ['https://voguenestt.netlify.app', 'http://localhost:5173'],
    credentials: true,
}));
app.use((0, compression_1.default)());
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)('dev'));
app.use('/api', userRouter_1.default);
app.use('/api', orderRouter_1.default);
app.use('/api/payment', stripe_1.default);
app.use('/api', refreshTokenLimiter_1.refreshTokenLimiter, refreshTokenRouter_1.default);
const PORT = process.env.PORT || 8050;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}/`);
});
const MONGODB_URL = process.env.MONGODB_URL;
if (!MONGODB_URL) {
    throw new Error('MONGODB_URL is not defined');
}
mongoose_1.default.connect(MONGODB_URL)
    .then(() => {
    console.log('Successfully connected to MongoDB');
})
    .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message);
    console.error(error.stack);
    process.exit(1);
});
