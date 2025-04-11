import Razorpay from "razorpay";

import crypto from 'crypto'
import { handlePaymentCapture,handlePaymentFaliure } from "../../utils/razorpayPaymentMethods.js";


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

    console.log('event of razorpay', event)

    let updatedOrder
    switch (event) {
        case event.event === 'payment.captured':
            updatedOrder = await handlePaymentCapture(event)
            break;
        
        case event.event === 'payment.failed':
           updatedOrder= await handlePaymentFaliure(event)
            break;
       
    }

    return res.status(200).json({
        success:true,
        updatedOrder,
        message:'webhook processed successfully'
      })  

} catch (error) {
  return res.status(500).json({
    success:false,
    message:'error in verifyng razorpay payment webhook'
  })  
}
}

