import Order from '../models/index.js'
import { validatePaymentVerification,validateWebhookSignature } from 'razorpay/dist/utils/razorpay-utils'

validatePaymentVerification()
validateWebhookSignature()

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
    } catch (error) {
        console.log('error in verifyng payment faliure event',error)
        throw new Error("error in verifyng payment faliure event");
        
    }

}

export {handlePaymentCapture,
        handlePaymentFaliure
}