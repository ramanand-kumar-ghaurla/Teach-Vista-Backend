import {generateCloudFrontURLFromKey,deleteFileFromS3} from '../../utils/index.js'
import { Lecture } from '../../models/lecture.model.js';
import { configDotenv } from 'dotenv';

configDotenv()



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
     const { key , statusCode } = req.body

     const StrKey=String(key)
     
     console.log('key in webhook req in main application',{
      key, statusCode
     })
 
     if(!key || !statusCode ){
         throw new Error(" key and success value is required for verification");
         
     }

     //validate on basis of success or status code
 
     if (statusCode === 200) {
      const {lectureCloudfrontURL} = generateCloudFrontURLFromKey(key)
   
      console.log('cloudfront url of transcoded lecture',lectureCloudfrontURL)
      
      if(!lectureCloudfrontURL){
        throw new Error('cloudfront url of lecture is required to save in db')
     }

    const objKeyArray= StrKey.split('/')

    const lectureID = objKeyArray[1]

    if(!lectureID){
      throw new Error(" lecture id is missing in verifyng webhook");
      
    }

    console.log('lecture Id in split method in verify webhook',lectureID)

    const updatedLecture = await Lecture.findByIdAndUpdate(lectureID,{
      $set:{videoURL:lectureCloudfrontURL,lectureStatus:'transcoded'},
    },{ new:true})

    if(!updatedLecture){
      throw new Error("no lecture found with this lecture id");
      
    }

    console.log('updated lecture with url ',updatedLecture)

    return res.status(200).json({
      success:true,
      message:'webhook request recieved and processed successfully'
     })

    // send email to teacer with lecture url for review
   
     } else{
      // send email teacher for failure of video transcoding and upload again
      return res.status(500).json({
        success:false,
        message:'error in video transcoding please upload the lecture again '
       })
     }
   
    
     
    
   } catch (error) {
    
    console.log('error in verifying container response',error)
   throw new Error('error in verifying container message')
   
   }

   
}

export {
    verifyContainerRes
}