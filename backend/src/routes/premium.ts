import { Router } from 'express'
import { authMiddleware } from '../middleware/auth'
import { createRazorpayOrder, verifyRazorpayPayment } from '../controllers/premiumController'

const router = Router()

router.use(authMiddleware)

router.post('/razorpay-order', createRazorpayOrder)
router.post('/verify-payment', verifyRazorpayPayment)

export default router
