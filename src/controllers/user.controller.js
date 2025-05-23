import { clerkClient, getAuth } from '@clerk/express';
import {Teacher,User,TeacherApplication, Order} from '../models/index.js'
import { verifyUser } from '../utils/verifyUser.js';
import { generateCloudfrontCookieForCourse } from '../utils/cloud/generateCookie.js';



//  Admin only logics

const approveTeacher = async (req, res) => {

    /**
     * steps:
     * 1. recieve req body with all fields
     * 2. check if loggedin user is admin or not
     * 3. validate the fields of body,
     * 4. find the user with email in recieved body
     * 5. if user find create an object from founded user and add teacher's properties
     * 6. delete the existing user and create new teacher 
     * 7. if teacher created successfully the status of teacher application update with Pending to Approved
     * 8. send the success response
     */
    try {
        const { 
                subject,
                experience, 
                email,
                skills,
                address,
                qualification
                } = req.body;

       /**TODO: add the condition for Admin only */

       const {userId} = getAuth(req)

       if(!userId){
        return res.status(401).json({
            message:'unauthorized request'
        })
       }

    //  

    const loggedInUser = await verifyUser(userId)

    if(loggedInUser.role !== 'Admin'){
        return res.status(400).json({ message: " You have no permission to perform this task" });
    }

        if ( !email) {
            return res.status(400).json({ message: " email is mandatory" });
        }

        // Find the existing user in the User collection
        const user = await User.findOne(
            {
               email:email
            }
        );

        if (!user) {
            return res.status(404).json({
                message: 'No user found associated with this userId'
            });
        }

        if (!subject || experience === undefined || !qualification || !address) {
            return res.status(400).json({
                message: "Subject, experience, address and qualification are required"
            });
        }

        if (user.role === 'Teacher') {
            return res.status(400).json({
                message: 'User is already a teacher'
            });
        }

        // Update role in Clerk
        await clerkClient.users.updateUserMetadata(user.clerkId, {
            publicMetadata: { role: 'Teacher' , subject:`${subject}`}
        });

        // Convert User to Teacher by creating a new Teacher document
        const teacherData = {
            ...user.toObject(), // Copy base user fields
            __t: 'Teacher', // Mark it as a Teacher for Mongoose
            role: 'Teacher',
            subject,
            experience,
           
            qualification,
            skills,
            address
        };

        // Delete old user and create a new Teacher entry
        await User.deleteOne({ clerkId: user.clerkId }); // Remove old user entry
        const teacher = await Teacher.create(teacherData); // Create teacher

       if(teacher){
      const applicationres= await TeacherApplication.findOneAndUpdate({
            $or:[ {email:email},{ userId : teacher._id}]
        },
    {
        $set:{ status: 'Approved'}
    },{new:true})

    
       }
        


        return res.status(200).json({
            success: true,
            data: teacher,
            message: 'Teacher approved successfully'
        });

    } catch (error) {
        console.error('Error in approving teacher:', error);
        return res.status(500).json({
            success: false,
            message: 'Error in approving teacher'
        });
    }
};


// logic for Application for being a teacher

const teacherApplication = async(req,res)=>{
    /**
     * steps:
     * 1. check if the user is loggedin or not
     * 2. validate the required fields of body
     * 3. find the user with userid or clerk id and check if the user is student or not 
     * 4. check if the user already applied ot not 
     * 5. if all ok create the application with pending status
     */

    try {
        const {  subject, address, experience, firstName,lastName,email,qualification ,skills} = req.body;


        console.log('req from frontend',req.body)
       /**TODO: add the condition for Student only and some modification in userid */

       if ( !subject || experience === undefined || !email || !qualification || !firstName || !address || !lastName) {
        return res.status(400).json({
            message: "all fields are required"
        });
    }

    const {userId} = getAuth(req)

        if(!userId){
        return res.status(401).json({
            message:'unauthorized request'
        })
        }
        // Find the existing user in the User collection
        let user = await User.findOne({ clerkId: userId });

        if (!user) {
            return res.status(404).json({
                message: 'No user found associated with this userId'
            });
        }

        console.log('user role in database',user.role)
         if (user.role !== 'Student') {
            return res.status(400).json({
                message: 'You are not eligible to aply for being a Teacher'
            });
        }

        console.log('user in database',user)

        //check if the user already aplied for teaher application'
        
        const alreadyApply = await TeacherApplication.findOne({userId:user._id})

        if(alreadyApply && alreadyApply.status ==='Pending'){
            return res.status(403).json({
                message:'You have applied for teacher already wait for Admin Approvel'
            })
        }

        if(alreadyApply && alreadyApply.status ==='Rejected'){
            return res.status(403).json({
                message:'Your application rejected by admin '
            })
        }

        const applicationRes = await TeacherApplication.create({
            userId:user._id,
            firstName:user.firstName,
            lastName:user.lastName,
            email,
            experience,
            subject,
            qualification,
            skills,
            address
        })

        console.log('response of teacher application',applicationRes)

        return res.status(200).json({
            success:true,
            yourApplication:applicationRes,
            message:'Your Application submitted successfully wait for admin Approvel'
        })

    } catch (error) {
        console.log('error in apllying application for teacher',error)

        return res.status(500).json({
            success:false,
            error:error,
            message:'Error occured in submitting your application'
        })


    }
}

const getApprovelApplication = async(req,res)=>{

   try {
    const {status,userId} = req.query
   
 
     const user = await verifyUser(userId||req.auth.userId)
 
     if(user.role !== 'Admin'){
         return res.status(400).json({
             success:false,
             message:'You have no permission to perform this task'
         })
     }
 
     const applications = await TeacherApplication.find({status:status})
 
     console.log('application for approvel',applications)
 
   return  res.status(200).json({
         success:true,
         applications,
         message:'Application for Teacher Approvel fetched successfully'
     })
   } catch (error) {
    return res.status(500).json({
        success:false,
        message:'Error in fetching appication '
    })
   }
}

const getApprovelApplicationByID = async(req,res)=>{
try {
    const {applicationId} = req.query

 const {userId} = getAuth()

    if(!applicationId){
        return res.status(400).json({
            success:false,
            message:'Application Id is required for get individual Application'
        })
    }
     const user = await verifyUser(userId)
 
     if(user.role !== 'Admin'){
         return res.status(400).json({
             success:false,
             message:'You have no permission to perform this task'
         })
     }

     const application = await TeacherApplication.findById({_id:applicationId})

     if(!application ){
        return res.status(404).json({
            success:false,
            message:'No application found associated with this applicationId'
        })
     }

    return res.status(200).json({
        success:true,
        application,
        message:'Your Application fetched successfully',

     })
    
} catch (error) {

    console.log('error in fetching application by id',error)
    return res.status(500).json({
        success:false,
        message:'Error in fetching Your Application '

     })
}
}

const getCloudFrontCookies = async(req,res)=>{

   try {

    const {userId} = getAuth()
     const {  courseId} = req.body
     // the userid in req.body is the clerk id which is come from frontend when user login 
 
     if(!courseId ){
         return res.status(401).json({
             success:false,
             message:'userId and userId is required for get cookies'
         })
 
     }
 
     const user = await verifyUser(userId)
 
    const {cloudfrontCookie}= await generateCloudfrontCookieForCourse(courseId,user._id)

    console.log('cloudfront cookies',cloudfrontCookie)
   const cookieOptions={
        secure:true,
        httpOnly:true 
   }
    return res.status(200)
    .cookie('CloudFront-Policy',cloudfrontCookie['CloudFront-Policy'],cookieOptions)
    .cookie('CloudFront-Signature',cloudfrontCookie['CloudFront-Signature'],cookieOptions) 
    .cookie('CloudFront-Key-Pair-Id',cloudfrontCookie['CloudFront-Key-Pair-Id'],cookieOptions)
    .json({
        success:true,
        message:'cloudfront cookie is generated successfully generated for course'
    })
   } catch (error) {
    console.log('error in getting cloudfront cookie for course',error)
    return res.status(500).json({
        success:false,
        message:'error in getting cloudfront cookie'
    })
   }

}

const getStudentPurchasedCourses = async(req,res)=>{

    try {
        const {userId} = getAuth()
        // the userid in req.body is the clerk id which is come from frontend when user login 
    
        if( !userId){
            return res.status(401).json({
                success:false,
                message:' userId is required for get cookies'
            })
    
        }
    
        const user = await verifyUser(userId)
    
      if(user.role !== 'Student'){
        return res.status(401).json({
            success:false,
            message:'only student can fetch purchased courses'
        })
      }

      const purchasedCourses = await Order.find({
        userId:user._id, status:'completed'
      }).populate({
        path:'courseId',
        select:' courseName duration validity catagory thumbnailURL',
        
      },)


     return res.status(200).json({
        success:true,
        purchasedCourses,
        message:'Purchased courses of Student is fetched successfully'
     })
      } catch (error) {
       console.log('error in fetching purchased courses of Student',error)
       return res.status(500).json({
           success:false,
           message:'error in fetching purchased courses of Student'
       })
      }
}
//  TODO: Remaining logic for getting application to approve teacher (for admin only) and couses (for teacher created and for student all courses or purchased) 


export { approveTeacher,
         teacherApplication,
         getApprovelApplication ,
         getApprovelApplicationByID,
         getCloudFrontCookies,
         getStudentPurchasedCourses
    };
