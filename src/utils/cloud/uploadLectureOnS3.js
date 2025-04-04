import { S3Client,
    CreateMultipartUploadCommand,
    CompleteMultipartUploadCommand,
    UploadPartCommand, 
    PutObjectCommand, 

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
    
        const {lectureId,courseId} = req.body
    
        if(!courseId || !lectureId ){
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
    
        const {courseId,lectureId,uploadId,partNo} = req.query
    
       
    
        if(!courseId || !lectureId || !uploadId || !partNo){
            return res.status(400).json({
                sucess:false,
                message:'all fields are required'
            })
        }
    
        const objKey = `${courseId}/${lectureId}.mp4`
    
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
    
        const { uploadId, parts, lectureId, courseId} = req.body
    
        console.log({
            uploadId,
            parts,
            lectureId,
            courseId
        })
    
        if(!courseId || !lectureId || !uploadId || !parts){
            return res.status(400).json({
                sucess:false,
                message:'all fields are required'
            })
        }
    
        const objKey = `${courseId}/${lectureId}.mp4`
    
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

    const createEmptyFolderWithCourseID = async( courseId)=>{

       try {
         const createFolderCommand = new PutObjectCommand({
             Bucket:process.env.AWS_TRANSCODED_BUCKET ,
             Key:`${courseId}/.keep`,
             Body:''
         })
 
         const response = await s3Client.send(createFolderCommand)
 
         console.log('response of create empty folder',response)
         
 
       } catch (error) {
        console.log('error increating empty folder')
        throw new Error(" error in creating empty forlder on s3");
        
       }
    }

    export {
        initiateMultipart,
        getPresignedURL,
        compeleteMultipartUpload,
        createEmptyFolderWithCourseID
    }