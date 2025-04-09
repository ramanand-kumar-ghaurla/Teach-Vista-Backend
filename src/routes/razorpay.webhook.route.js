import { Router } from "express";
import {varifyPayment} from '../webhooks/razorpay/razorpayPaymentWebhook'

const router = Router()

router.route('/verify-payment',varifyPayment)

export default router