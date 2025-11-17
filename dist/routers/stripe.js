"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const stripeController_1 = require("../controllers/stripeController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.post('/create-checkout-session', auth_1.middleware, stripeController_1.makePayment);
exports.default = router;
