import express from 'express';
import { signUp, login, logOut } from '../controllers/userController';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/sign-out', logOut)

export default router;
