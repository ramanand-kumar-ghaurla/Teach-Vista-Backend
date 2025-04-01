import { User } from "../models/index.js";
import { clerkClient } from "@clerk/express";


export const verifyUser = async(userId)=>{

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