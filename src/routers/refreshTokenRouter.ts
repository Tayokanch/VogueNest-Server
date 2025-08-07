import express from 'express';
import { refreshToken } from '../controllers/refreshToken';

const router = express.Router();

router.get('/refreshToken', refreshToken);

export default router;
