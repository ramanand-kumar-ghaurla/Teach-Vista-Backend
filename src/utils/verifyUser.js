import { User } from "../models";
import { clerkClient } from "@clerk/express";


export const verifyUser = async(userId)=>{

    if(!userId){
        res.status(400).json({
            message:'unauthorized req'
        })
    }


    const user = await User.findOne({
        clerkId:userId  // || userId
    })

    if(!user){
        return res.status(404).json({
            message: 'No user found associated with this userId'
        });
    }

   
   return user
}