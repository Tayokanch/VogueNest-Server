import express from 'express'
import { authenticateUser } from '../middleware/auth'
import { postOrder } from '../controllers/ordersController'
import { getUserOrder } from '../controllers/ordersController'

const router = express.Router()

router.post('/send-orders', authenticateUser, postOrder);
router.get('/orders', authenticateUser, getUserOrder)

export default router;