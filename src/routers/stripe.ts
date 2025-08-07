import express from 'express';
import { makePayment } from '../controllers/stripeController';
import { middleware } from '../middleware/auth';

const router = express.Router();

router.post('/create-checkout-session', middleware, makePayment);

export default router;
