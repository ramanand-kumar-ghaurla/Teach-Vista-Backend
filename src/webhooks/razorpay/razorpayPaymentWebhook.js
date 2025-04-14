import Razorpay from "razorpay";

import crypto from 'crypto'
import { handlePaymentCapture,handlePaymentFaliure } from "../../utils/razorpayPaymentMethods.js";



 export const varifyPayment = async(req,res)=>{
try {

  console.log(' webhook calling')
    
    const body = req.body

    console.log('webhook body',body)
    const razorpaySignature = req.headers['x-razorpay-signature'];

  
  
    // generate a new webhook endpoint with webhook secret
    const expectedSignature = crypto
    .createHmac('sha256',process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(JSON.stringify(body))
    .digest('hex')

    if(expectedSignature !== razorpaySignature){
      throw new Error(" invalid razorpay signature");
      
    }

    

    let updatedOrder
    switch (body.event) { 
      case 'payment.captured': 
          updatedOrder = await handlePaymentCapture(body); 
          break;
  
      case 'payment.failed': 
          updatedOrder = await handlePaymentFaliure(body); 
          break;
  
    
    
        }

      

    console.log('updated order',updatedOrder)

    return res.status(200).json({
        success:true,
        updatedOrder,
        message:'webhook processed successfully'
      })  

} catch (error) {

  console.log('erorr in verifying razorpay payment',error)
  return res.status(500).json({
    success:false,
    message:'error in verifyng razorpay payment webhook'
  })  
}
}

