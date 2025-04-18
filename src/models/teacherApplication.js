import { Schema,model } from "mongoose";

const teacherApplicationFormSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
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
        
    },
    subject: {
        type:String,
        required:true,
        maxLength:[50,'subject name must be at most 50 characters']
        
    },
   experience:{
        type:Number,
        required:true,
        
    },
    qualification:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:['Pending','Approved','Rejected'],
        default:'Pending'
    },
    address:{
        type:String,
        required:true
    },
    skills:{
        type:String,
    },
},{
    timestamps:true
})

export const TeacherApplication = model('TeacherApplication',teacherApplicationFormSchema)