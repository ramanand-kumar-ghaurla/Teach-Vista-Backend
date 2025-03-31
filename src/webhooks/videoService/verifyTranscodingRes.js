import {generateCloudFrontURLFromKey} from '../../utils/cloud/generateUrl.js'
import { Lecture } from "../../models";



const verifyContainerRes = async(req , res)=>{

    /** steps
     * retrieve success status m3u8 file key from req.body
     * if(success === true) {
     * get the object from transcoded s3 bucket
     * make the url of master.m3u8 file and store it in db as lecture url
     * send the response or emal to teacher to review
     * }
     * else {
     * throw error or send email for uploading lecture again again 
     * }
     * 
     */

 
   try {
     const { key , success } = req.body
 
     if(!key || !success ){
         throw new Error(" key and response status is required for verification");
         
     }
 
     // generate a cloudfront url from key
     
     const {lectureCloudfrontURL} = generateCloudFrontURLFromKey(key)
   
     console.log('cloudfront url of transcoded lecture',lectureCloudfrontURL)

     if(!lectureCloudfrontURL){
        throw new Error('cloudfront url of lecture is required to save in db')
     }


     const response  = await Lecture.fi
   } catch (error) {
    
    console.log('error in verifying container response',error)
   throw new Error('error in verifying container message')
   }

   
}

export {
    verifyContainerRes
}