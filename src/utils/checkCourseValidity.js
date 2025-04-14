// function for checking if the student purchased course and validity is over or zWp9TzsWP90NnJ7uOSctVnGHBxBl
/**
 * check user is a student or not 
 * accept userid or courseid as parameter
 * find a order with these parameter
 * if found then check the validtill with current date 
 * id it is greater then only return true or detail of student 
 * if not send expiry response to student
 */

import { Order } from "../models/index.js"

export const checkCourseVakidity = async(userId,courseId)=>{

    const courseOrder = await Order.findOne({
       $and:[ {  userId:userId }, { courseId:courseId},{ status:'completed'}]
    },{purchasedAt:1 , validTill:1,status:1})

    console.log(courseOrder,'order with course ')

    if(!courseOrder){
      throw new Error("The student did not purchase requested course");
      
    }

     const current = new Date()

    let isValid
    if(current <=  courseOrder.validTill){
        isValid = true
    }else{
        isValid=false
    }

    return {isValid}
}