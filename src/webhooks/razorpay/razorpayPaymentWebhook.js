import Razorpay from "razorpay";
import { validateWebhookSignature,validatePaymentVerification, } from "razorpay/dist/utils/razorpay-utils";
import crypto from 'crypto'
import { handlePaymentCapture,handlePaymentFaliure } from "../../utils/razorpayPaymentMethods";


 export const varifyPayment = async(req,res)=>{
try {
    
    const body = req.body
    const razorpaySignature = req.headers.get('x-razorpay-signature')

    // generate a new webhook endpoint with webhook secret
    const expectedSignature = crypto
    .createHmac('sha256',process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(body)
    .digest('hex')

    if(expectedSignature !== razorpaySignature){
        return res.status(401).json({
            success:false,
            message:'invalid signature'
        })
    }

    const event = JSON.parse(body)

    switch (event) {
        case event.event === 'payment.captured':
            await handlePaymentCapture(event)
            break;
        
        case event.event === 'payment.failed':
            await handlePaymentFaliure(event)
            break;
        default:
            break;
    }

} catch (error) {
  return res.status(500).json({
    success:false,
    message:'error in verifyng razorpay payment webhook'
  })  
}
}

