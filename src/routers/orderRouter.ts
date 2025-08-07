import express from 'express'
import { middleware } from '../middleware/auth'
import { postOrder } from '../controllers/ordersController'
import { getUserOrder } from '../controllers/ordersController'

const router = express.Router()

router.post('/send-orders', middleware, postOrder);
router.get('/orders', middleware, getUserOrder)

export default router;