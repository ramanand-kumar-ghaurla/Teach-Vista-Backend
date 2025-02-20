import mongoose, {model,Schema} from 'mongoose'
import { User } from './user.model'

const studentSchema = new Schema({
    field: {
        type:String,
        required:true,
        maxLength:[50,'subject name must be at most 50 characters']
        
    },
   
    purchasedCourses:[
       {
        type:Schema.Types.ObjectId,
        ref:'Course'
       }
    ],

})

 export const Student = User.discriminator('Student',studentSchema)