import { clerkClient,getAuth } from "@clerk/express";
import { User, Course, Teacher } from "../models/index.js";
import { createEmptyFolderWithCourseID } from "../utils/cloud/uploadLectureOnS3.js";
import {verifyUser} from '../utils/verifyUser.js'


const createCourse = async(req,res) => {

    try {

        /** Steps:
         * 1. recieve all imp properties from req body and check auth
         * 2. check the role of loggendin user for Teacher
         * 3. varify the course catagory and teacher subject
         * 4. create a empty folder with course Id
         * 
         */

        const { courseName , description, duration, price,catagory,validity} = req.body

        const {userId} = getAuth(req)

         

        
        

        const user = await User.findOne({
            clerkId:userId  // || userId
        })

        if(validity){
            Number(validity)
            
        }
       

        if(!user){
            return res.status(404).json({
                message: 'No user found associated with this userId'
            });
        }


        if(!courseName || !description || !duration || !price || !catagory){
            return res.status(400).json({
                message: "all fields are required"
            });
        }

        if(user.role !== 'Teacher' ){

            return res.status(401).json({
                       message:'you have no permission to perform this task '
                   })
        }

        if(user.subject !== catagory ){

            return res.status(401).json({
                       message:'please create a course relaed to your field'
                   })
        }

        const course = await Course.create({
            courseName,
            teacher:user._id,
            description,
            validity,
            duration,
            price,
            catagory,
            status:'in-progress'

        })

        console.log('newly created course',course)
    const updatedTeacher=   await Teacher.findByIdAndUpdate(course.teacher,{
        $push:{ createdCourses : course._id}
       },{ new:true

       })

       console.log('added couse teacher',updatedTeacher)
        

       // await createEmptyFolderWithCourseID(course._id)


        return res.status(200).json({
            success: true,
            course:course,
            message:'Your course created successfully'
        })


    } catch (error) {
        
        console.log('error in creating course',error)
        res.status(500).json({
            success:false,
            message:'An error occured in creatin your course'
        })
    }
}

const getCreatedCourse = async(req,res)=>{
    try {
        
        
        
         const {userId} = getAuth(req)

        if(!userId){
           return res.status(400).json({
                message:'unauthorized req'
            })
        }

      const user = await verifyUser(userId)
        if(user.role !== 'Teacher' ){

            return res.status(401).json({
                       message:'only Teachers can get his created courses'
                   })
        }

        const courses =await Course.find({
            teacher:user._id
        })

        
        return res.status(200).json({
            success: true,
            courses:courses,
            message:'Your course fetched successfully'
        })

    } catch (error) {
        console.log('error in fetching course',error)
        res.status(500).json({
            success:false,
            message:'An error occured in fetching your course'
        })
    }
}

const getCourseById = async(req,res)=>{
    try {
        
        const {courseId} = req.query

        if(!courseId){
            return res.status(401).json({
                success:false,
                message:'course id is required for fething course'
            })
        }

        const course = await Course.findById(courseId).populate([{
            path:'teacher',
            select:' firstName lastName heading'
        },
        {
            path:'lectures',
            select:'title description'
        }
    ])

        if(!course){
            return res.status(404).json({
                success:false,
                message:'no course found with this course id'
            })
        }

        return res.status(200).json({
            success:false,
            course,
            message:'course details fetched successfully'
        })
    } catch (error) {
        console.log('error in fetching detailed course',error)

        return res.status(404).json({
            success:false,
            message:'error in fetching detailed course'
        }) 
    }
}

export {
    createCourse,
    getCreatedCourse,
    getCourseById
}