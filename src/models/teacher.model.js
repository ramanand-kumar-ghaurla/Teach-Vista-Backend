import mongoose, {model,Schema} from 'mongoose'
import { User } from './user.model.js'

const teacherSchema = new Schema({
    subject: {
        type:String,
        required:true,
        maxLength:[50,'subject name must be at most 50 characters']
        
    },
    heading:{
        type:String
    },
    experience:{
        type:Number,
        required:true,
        
    },
    createdCourses:[
       {
        type:Schema.Types.ObjectId,
        ref:'Course'
       }
    ],

})

 export const Teacher = User.discriminator('Teacher',teacherSchema)