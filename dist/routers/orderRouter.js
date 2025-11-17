"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middleware/auth");
const ordersController_1 = require("../controllers/ordersController");
const ordersController_2 = require("../controllers/ordersController");
const router = express_1.default.Router();
router.post('/send-orders', auth_1.middleware, ordersController_1.postOrder);
router.get('/orders', auth_1.middleware, ordersController_2.getUserOrder);
exports.default = router;
