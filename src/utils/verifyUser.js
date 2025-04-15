import { User } from "../models/index.js";
import { clerkClient } from "@clerk/express";


export const verifyUser = async(userId)=>{

    //TODO: UPDATE verify user logic with below code 
    //const {userId} = getAuth(req.body)

    //    if(!userId){
    //     return res.status(401).json({
    //         message:'unauthorized request'
    //     })
    //    }

    //    const {publicMetadata} = await clerkClient.users.getUser(userId)

    //    if(!publicMetadata.role === 'Admin'){
    //     return res.status(401).json({
    //         message:'you have no permission to perform this task '
    //     })
    //    }


    if(!userId){
        throw new Error(" user id is requires");
    }


    const user = await User.findOne({
        clerkId:userId  // || userId
    })

    if(!user){
       throw new Error(" no user found with this user id ");
       
    }

   
   return user
}