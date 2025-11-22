import express from 'express';
import { signUp, login, logOut, getUser } from '../controllers/userController';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/sign-out', logOut)
router.get('/users', getUser)
export default router;
