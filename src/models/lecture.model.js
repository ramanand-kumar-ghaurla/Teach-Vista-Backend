import {Schema,model} from 'mongoose'

const lectureSchema = new Schema({
    title:{
        type:String,
        required:true,
        maxLength:[100,'lecture title must have 100 characters at most']
    },
    teacher:{
        type:Schema.Types.ObjectId,
        ref:'Teacher',
        required:true
    },
    description:{
        type:String,
        required:true,
        maxLength:[500,'lecture title must have 500 characters at most']
    },
    courseId:{
        type: Schema.Types.ObjectId,
        ref: 'Course',
        required:true
    },
    lectureStatus :{
        type:String,
        required:true,
        enum:['trancoding','transcoded'],
        default:'trancoding'
    },
    videoURL:{
        type:String,
        
    }

})

export const Lecture = model('Lecture',lectureSchema)