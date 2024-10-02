import express from 'express';
import { makePayment } from '../controllers/stripeController';
import { authenticateUser } from '../middleware/auth';

const router = express.Router();

router.post('/create-checkout-session', authenticateUser, makePayment);

export default router;
