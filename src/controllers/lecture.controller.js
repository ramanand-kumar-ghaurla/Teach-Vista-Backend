import { Lecture,Course } from '../models/index.js'
import { verifyUser } from '../utils/verifyUser.js'


const createLecture = async(req , res)=>{
try {
    
        /**steps
         *  destructure imp fields from request
         *  validate the fields
         * verify looged in user is teacher and owner of course
         * if yes lecture detail store in db
         * return the res
         * 
         */
    
        const { title, courseId, userId, description} = req.body
    
        if(!title || !courseId || !userId ||!description){
            return res.status(400).json({
                message:'all fields are required to move further'
            })
        }
    
        const user = await verifyUser(userId)
    
        if(!user){
          return res.status(404).json({
            message:' no user found with this user id'
           })
            
         }
    
         const course = await Course.findById(courseId)
    
         if(!course){
          return  res.status(404).json({
             message:' no course  found with this courseId id'
            })
             
          }
    
         if(user.role !== 'Teacher' && user._id !== course.teacher){
            if(!user){
               return res.status(400).json({
                 message:' You are not eligible to upload lecture '
                })
                 
              }
         }
    
         const lecture = await Lecture.create({
            courseId:courseId,
            title:title,
            description:description,
            teacher:user._id,
            lectureStatus:'trancoding'
         })

         console.log(' newly lecture created by teacher',lecture)

          
            const updatedCourse=   await  course.updateOne({
          $push:{ lectures: lecture._id}
         },{ new:true})
                console.log('added lecture in course',updatedCourse)
    
         return res.status(200).json({
            success:true,
            lecture:lecture,
            message:'Your Lecture Uploaded successfully. You are informed after successfull processing of video lecture.'
         })
} catch (error) {
    
    console.log('error in storing lecture in database',error)
    return res.status(500).json({
        success:false,
        message:'An error occured while storin lecture details in database'
     })
}
}

export {
    createLecture
}
