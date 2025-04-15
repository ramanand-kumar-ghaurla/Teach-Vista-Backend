import {Order,Course} from '../models/index.js'
import Razorpay from 'razorpay'
import { getAuth } from '@clerk/express'
import {verifyUser} from '../utils/verifyUser.js'
import { now } from 'mongoose'

const razorpay = new Razorpay({
    key_id:process.env.RAZORPAY_PUBLIC_KEY,
    key_secret:process.env.RAZORPAY_SECRET_KEY
})

/**Steps
 * recieve user and course id in req and validate
 * find course and user with these fields and validate 
 * check user role i sstudent and he didn't buy course before 
 * if all okay create razorpay Order
 * create order in db 
 * if all of return success res
 */

const createOrder = async(req,res)=>{

    try {

        
        //use get auth here

        const {courseId,userId} = req.body

      //  const {userId} = getAuth(req.body)


        if(!courseId || !userId) {
            return res.status(401).json({
                success:false,
                message:'course Id and user ID is required to move further'
            })
        }

        const user = await verifyUser(userId)

        const course = await Course.findById(courseId)

        // validate couse and user

        if(!user || !course){
            throw new Error(" now user assosiated with this userId");
            
        }

      //  validate user role

      if(user.role !== 'Student'){
        return res.status(401).json({
            success:false,
            message:'only student can purchase course'
        })
      }

      // todo: apply coopen discout functionality here

      // validate student puchased couse within course validity

     const alreadyPurchased =  await Order.findOne({ userId:user._id , courseId : courseId})

     if (alreadyPurchased && new Date(alreadyPurchased.validTill) > new Date()) {
        return res.status(400).json({
            success: false,
            message: 'You cannot purchase this course again during its active validity period.',
        });
    }
    

     // create razorpay order

    const razorpayOrder = await razorpay.orders.create({
        amount:1 * 100,
        currency:'INR',
        receipt:`receipt+${Date.now}` ,
        notes:{
            'Student Name': `${user.firstName + "" + user.lastName}`,
            'Student Email': `${user.email}`,
            'Purchased Course': ` ${course.courseName}`
        }
     })

     if(!razorpayOrder){
        throw new Error('error in creating razorpay order')
     }

     const DBOrder = await Order.create({
        courseId:courseId,
        userId: user._id,
        amount: razorpayOrder.amount,
        purchasedAt: new Date(Date.now()),
        razorpayOrderId:razorpayOrder.id,
        status:'pending',
        validTill:new Date(Date.now() + course.validity * 24 * 60 * 60 * 1000)
     })

     if(!DBOrder){
        throw new Error("error in creating oreder in database");
        
     }

     return res.status(200).json({
        success:true,
        order:DBOrder,
        message:'your order placed successfully wait for processing'
     })

        
    } catch (error) {
        console.log('error in creating order',error)
        return res.status(500).json({
            success:false,
            message:'error in creating order in razorpay or database'
         })
    }
}



export {
    createOrder
}
