import {Schema , model} from "mongoose";


const userSchema = new Schema({
    clerkId:{
        type:String,
        required:true
    },
    firstName:{
        type:String,
        required:true,
        trim:true

    },
    lastName:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    role:{
        type:String,
        enum:['Teacher','Admin','Student'],
        
    }
},{
    timestamps:true,
    discriminatorKey:'role',
    collection:'users'
})

export const User = model('User',userSchema)