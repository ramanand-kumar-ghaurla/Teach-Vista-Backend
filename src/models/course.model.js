import {Schema,model} from 'mongoose'

const courseSchema = new Schema({
    courseName:{
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
        maxLength:[1000,'lecture title must have 1000 characters at most']
    },
    duration:{
        type:String,
        required:true
    },
    price:{
        type: Number,
        required:true
    },
    catagory:{
        type:String,
        required:true
    },
    status:{
        type:String,
        required:true,
        enum:['in-progress','compeleted'],
        default:'in-progress'
    },
    thumbnailURL:{
        type:String
    },
   
    
    lectures:[
        {
            type:Schema.Types.ObjectId,
            ref:'Lecture',
        }
    ]

})

export const Course = model('Course',courseSchema)