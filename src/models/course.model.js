import {Schema,model} from 'mongoose'

const courseSchema = new Schema({
    name:{
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
    thumbnailURL:{
        type:string
    },
    lectures:[
        {
            type:Schema.Types.ObjectId
        }
    ]

})

export const Course = model('Course',courseSchema)