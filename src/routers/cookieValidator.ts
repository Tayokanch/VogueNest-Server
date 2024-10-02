import express from 'express';
import { validateCookie } from '../middleware/userAuth';

const router = express.Router();

router.post('/cookie-validator', validateCookie)

export default router