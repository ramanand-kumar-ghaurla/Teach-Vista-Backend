import { json } from "express";
import { Lecture } from "../../models";
import { S3Client , GetObjectCommand} from "@aws-sdk/client-s3";


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

    const s3Client = new S3Client({
        region: process.env.AWS_REGION,
        credentials: {
            accessKeyId:process.env.AWS_ACCESS_KEY ,
            secretAccessKey: process.env.AWS_SECRET_KEY
        }
    })

   
   try {
     const { key , success } = req.body
 
     if(!key || !success ){
         throw new Error(" key and response status is required for verification");
         
     }
 
     // generate a cloudfront url from key
     
   

   } catch (error) {
    
    console.log('error in verifying container response',error)
   throw new Error('error in verifying container message')
   }

   
}

export {
    verifyContainerRes
}