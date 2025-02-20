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
        required:true,
        enum:['User','Teacher','Admin','Student']
    }
},{
    timestamps:true
})

export const User = model('User',userSchema)