import { S3Client,
    CreateMultipartUploadCommand,
    CompleteMultipartUploadCommand,
    UploadPartCommand , 

} from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { configDotenv } from 'dotenv'

configDotenv()




    const s3Client = new S3Client({
        credentials:{
             accessKeyId:process.env.AWS_ACCESS_KEY,
             secretAccessKey:process.env.AWS_SECRET_KEY,
        },
        region:process.env.AWS_REGION
    })

    const params = {
        bucket:process.env.AWS_BUCKET_NAME,
        ContentType:'video/mp4',
        Expires:3600
    }

    async function  initiateMultipart( req,res){
    
        const {title,courseId} = req.body
    
        if(!courseId || !title ){
            return res.status(400).json({
                sucess:false,
                message:'all fields are required'
            })
        }
    
        const objKey = `${courseId}/${lectureId}.mp4`
    
      
    
       try {
    
        const initiateMultipartCommand = new CreateMultipartUploadCommand({
            Bucket: params.bucket,
            Key:objKey,
            ContentType:params.ContentType
        
        })
    
        const response = await s3Client.send(initiateMultipartCommand)
    
       
       return  res.status(200).json({
            sucess:true,
            uploadId:response.UploadId
        })
       
    
       } catch (error) {
        
        console.log('error in initiating multipart',error)
        
       return  res.status(500).json({
            success:false,
            message:'error in initiating multipart '
        })
        
       }
    }

    const getPresignedURL = async(req,res)=>{
    
        const {courseId,title,uploadId,partNo} = req.query
    
       
    
        if(!courseId || !title || !uploadId || !partNo){
            return res.status(400).json({
                sucess:false,
                message:'all fields are required'
            })
        }
    
        const objKey = `${courseId}/${title}.mp4`
    
     try {
        
        const uploadCommand = new UploadPartCommand({
            Bucket: params.bucket,
            Key:objKey,
            UploadId:uploadId,
            PartNumber:partNo,
            ContentType:params.ContentType
           })
        
           const presignedURL = await getSignedUrl(s3Client,uploadCommand,{
            expiresIn:params.Expires,
            signingRegion:process.env.AWS_REGION
           })
        
    
          return  res.status(200).json({
            sucess:true,
            presignedURL,
            message:'presined url generated successfully for upload video'
           })
     } catch (error) {
        console.log('error in generating presigned url',error)
        
       return res.status(500).json({
            success:false,
            message:'error in generating presigned url'
        })
        
     }
    }

    const compeleteMultipartUpload = async(req,res)=>{
    
        const { uploadId, parts, title, courseId} = req.body
    
        console.log({
            uploadId,
            parts,
            title,
            courseId
        })
    
        if(!courseId || !title || !uploadId || !parts){
            return res.status(400).json({
                sucess:false,
                message:'all fields are required'
            })
        }
    
        const objKey = `${courseId}/${title}.mp4`
    
       try {
         const compeleteUploadCommand = new CompleteMultipartUploadCommand({
             Bucket:params.bucket,
             Key:objKey,
             UploadId:uploadId,
             MultipartUpload:{
                 Parts:parts
             }
         })
     
         const response = await s3Client.send(compeleteUploadCommand)
    
        
    
         return res.status(200).json({
            success:true,
            response,
            message:'Your Lecture uploaded Successfully wait for processed url'
         })
     
       } catch (error) {
        
        console.log('error in compeleting multipart upload',error)
        return res.status(500).json({
            success:false,
            message:'error in compeleting multipart upload'
         })
       }
    
    } 

    export {
        initiateMultipart,
        getPresignedURL,
        compeleteMultipartUpload
    }