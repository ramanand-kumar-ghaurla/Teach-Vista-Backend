import { clerkClient,getAuth } from "@clerk/express";
import { User, Course, Teacher } from "../models/index.js";


const createCourse = async(req,res) => {

    try {

        /** Steps:
         * 1. recieve all imp properties from req body and check auth
         * 2. check the role of loggendin user for Teacher
         * 3. varify the course catagory and teacher subject
         * 
         * 
         */

        const { courseName , description, duration, price,catagory,clerkId} = req.body

        // const {userId} = getAuth(req.body)

        if(!clerkId){
            res.status(400).json({
                message:'unauthorized req'
            })
        }

        const user = await User.findOne({
            clerkId:clerkId  // || userId
        })

       

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
            duration,
            price,
            catagory,
            status:'in-progress'

        })

        console.log('newly created course',course)

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
        
        
        const { clerkId} = req.body

        // const {userId} = getAuth(req.body)

        if(!clerkId){
            res.status(400).json({
                message:'unauthorized req'
            })
        }

        const user = await User.findOne({
            clerkId:clerkId  // || userId
        })


       

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

export {
    createCourse,
    getCreatedCourse
}