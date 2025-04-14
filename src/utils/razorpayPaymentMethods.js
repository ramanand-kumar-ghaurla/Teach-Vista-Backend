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
        $set:{ razorpayPaymentId: paymentDetails.id, status:'completed',amount: paymentDetails.amount }
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





