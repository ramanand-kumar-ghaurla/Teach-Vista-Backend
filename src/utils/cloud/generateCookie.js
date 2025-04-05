import {getSignedCookies, } from '@aws-sdk/cloudfront-signer'
import {checkCourseVakidity} from '../checkCourseValidity.js'
import { Course, User } from '../../models/index.js'
import { configDotenv } from 'dotenv'
import AWS from 'aws-sdk'

configDotenv()

/**
 * steps:
 * 1. find user with id and check role
 * if teacher set cookies {
 * check created course listed 
 * if he is creater of course then only generate cookies for 7 days 
 * 
 * }else if ( student ) {
 * use method for checking validity of Course
 * if yes generate cookie for 7 days
 * }
 * 
 */

const generateCookie = async(courseId)=>{

   try {
     const cloudfront = new AWS.CloudFront.Signer(
         process.env.CLOUDFRONT_KEY_PAIR_ID,
         process.env.CLOUDFRONT_PRIVATE_KEY.replace(/\\n/g, '\n'),
        Math.floor(  Date.now()/1000) + 60*60*24*7
 )
 
 const cloufrontDomain = process.env.CLOUDFRONT_DOMAIN
 
 const expiry = Math.floor(  Date.now()/1000) + 60*60*24*7;
 console.log('expiry',expiry)

 console.log(`${cloufrontDomain}/${courseId}/`)
 
 const policy = JSON.stringify({
     "Statement": [
         {
             "Resource": `${cloufrontDomain}/${courseId}*`,
             "Condition": {
                 "DateLessThan": {
                     "AWS:EpochTime":expiry
                 },
                
             }
         }
     ]
 })

 
 return cloudfront.getSignedCookie({
   policy:policy
 })
 
   } catch (error) {
    console.log(' error in initiating cookie in cookie policy method',error)
    throw new Error("error in cloudfront policy method");
    
   }

}

export const generateCloudfrontCookieForCourse =  async(courseId,userId,)=>{

  try {
      //find user 
  
      let cloudfrontCookie
  
      const user = await User.findById(userId)
  
      if(!user){
          throw new Error(" no user find with this user id");
          
      }
    
      if(user.role === 'Teacher'){
  
       const course =  await Course.findById(courseId)

       
  
       if(user.createdCourses.length > 0) {
  
       if(user.createdCourses.includes(course._id)){
        console.log('true teacher is owner')
        cloudfrontCookie = await  generateCookie(courseId)
       }

          
       }else{
        throw new Error('Course access is only for course owner tacher')
       }
  
       
         
      }else if(user.role === 'Student'){
          // check validity
  
        const {isValid}=  await checkCourseVakidity(userId,courseId)
  
        if( isValid){
          cloudfrontCookie = await generateCookie(courseId)
          
        }else{
         throw new Error("course validity has expired ");
         
        }
  
  
      }else{
          throw new Error(" Aceess denied");
          
      }
  
  return {cloudfrontCookie}
  } catch (error) {
    console.log('error in generating cloudfront course access cookie',error)
    throw new Error("error in generating  cloudfront cookie");
    
  }
}