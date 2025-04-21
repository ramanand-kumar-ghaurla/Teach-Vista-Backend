import { User } from "../models/index.js";
import { clerkClient } from "@clerk/express";
import { getAuth } from "@clerk/express";


export const verifyUser = async(userId)=>{

    //TODO: UPDATE verify user logic with below code 
  

       if(!userId){
        return res.status(401).json({
            message:'unauthorized request'
        })
       }

    


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