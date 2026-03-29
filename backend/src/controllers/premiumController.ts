import { Request, Response } from 'express'
import Razorpay from 'razorpay'
import crypto from 'crypto'
import { db } from '../config/firebase'
import { AuthRequest } from '../middleware/auth'

const getRazorpayInstance = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error('Razorpay keys are missing in Environment Variables')
  }
  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
  })
}

export const createRazorpayOrder = async (req: AuthRequest, res: Response) => {
  try {
    const uid = req.user!.uid
    
    const options = {
      amount: 9900, // ₹99.00 in paise
      currency: "INR",
      receipt: `receipt_${uid}_${Date.now()}`
    }

    const razorpay = getRazorpayInstance()
    const order = await razorpay.orders.create(options)
    res.status(200).json({ orderId: order.id, amount: options.amount })

  } catch (error) {
    console.error('Razorpay order error:', error)
    res.status(500).json({ error: 'Failed to create payment order' })
  }
}

export const verifyRazorpayPayment = async (req: AuthRequest, res: Response) => {
  try {
    const uid = req.user!.uid
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body

    const body = razorpay_order_id + "|" + razorpay_payment_id
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET || '')
      .update(body.toString())
      .digest('hex')

    if (expectedSignature === razorpay_signature) {
      // Payment is legit
      
      const expiry = new Date()
      expiry.setMonth(expiry.getMonth() + 1) // 1 month premium
      
      await db.collection('users').doc(uid).update({
        premiumStatus: true,
        premiumExpiryDate: expiry
      })

      return res.status(200).json({ success: true, message: 'Payment verified successfully' })
    } else {
      return res.status(400).json({ success: false, error: 'Invalid signature' })
    }
  } catch (error) {
    console.error('Payment verification error:', error)
    res.status(500).json({ error: 'Failed to verify payment' })
  }
}
