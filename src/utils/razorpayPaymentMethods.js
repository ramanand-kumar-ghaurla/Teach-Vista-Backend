import {Order} from '../models/index.js'
import { generateCloudfrontCookieForCourse } from './cloud/generateCookie.js'



/**
 * success payment:
 * find the order and update the required fields 
 * generate the cloudfront cookie to access vedios
 * TODO: update verify course validy method 
 * 
 * payment faliure :
 * 
 */

const handlePaymentCapture = async(reqBody)=>{

  try {
      if(!reqBody){
          throw new Error('req body is required to vrify payment ')
      }

      const paymentDetails = reqBody.payload.payment.entity

      console.log('payment details in handle payment ',paymentDetails)

      const updatedOrder = await Order.findOneAndUpdate({
        razorpayOrderId:paymentDetails.order_id,
        status:'pending'
      },{
        $set:{ razorpayPaymentId: paymentDetails.id, status:'completed' }
      },
      {
        new:true
      }
    ).populate('userId','firstName email')

    console.log(updatedOrder,'updated order in handle capture payment function')

    await generateCloudfrontCookieForCourse(updatedOrder.courseId, updatedOrder.userId)

    return { updatedOrder}
  
  } catch (error) {
    
    console.log('error in verifyng payment capture event',error)
        throw new Error("error in verifyng payment capture event");
        
    
  }

}

const handlePaymentFaliure = async (reqBody) => {
    try {
        if(!reqBody){
            throw new Error('req body is required to vrify payment ')
        }

        const paymentDetails = reqBody.payload.payment.entity
        const updatedOrder = await Order.findOneAndUpdate({
            razorpayOrderId:paymentDetails.order_id,
            status:'pending'
          },{
            $set:{ razorpayPaymentId: paymentDetails.id, status:'failed' }
          },
          {
            new:true
          }
        )

        return { updatedOrder}

        // send a transaction faliure email to stdent
        
    } catch (error) {
        console.log('error in verifyng payment faliure event',error)
        throw new Error("error in verifyng payment faliure event");
        
    }

}

export {handlePaymentCapture,
        handlePaymentFaliure
}





const razorpayEvent ={
    "entity": "event",
    "account_id": "acc_BFQ7uQEaa7j2z7",
    "event": "payment.failed",
    "contains": [
      "payment"
    ],
    "payload": {
      "payment": {
        "entity": {
          "id": "pay_DEAU825sJlCbGa",
          "entity": "payment",
          "amount": 50000,
          "currency": "INR",
          "status": "failed",
          "order_id": "order_DEATVTRRctwEGb",
          "invoice_id": null,
          "international": false,
          "method": "netbanking",
          "amount_refunded": 0,
          "refund_status": null,
          "captured": false,
          "description": null,
          "card_id": null,
          "bank": "HDFC",
          "wallet": null,
          "vpa": null,
          "email": "gaurav.kumar@example.com",
          "contact": "+919876543210",
          "notes": [],
          "fee": null,
          "tax": null,
          "error_code": "BAD_REQUEST_ERROR",
          "error_description": "Payment failed",
          "error_source": "bank",
          "error_step": "payment_authorization",
          "error_reason": "payment_failed",
          "acquirer_data": {
            "bank_transaction_id": null
          },
          "created_at": 1567610214
        }
      }
    },
    "created_at": 1567610215
  }