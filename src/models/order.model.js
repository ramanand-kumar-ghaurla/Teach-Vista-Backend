import mongoose,{Schema,model} from "mongoose";

const orderSchema = new Schema({
    userId:{
        type:Schema.Types.ObjectId,
        ref:'User',
        required:true
    },
    courseId:{
        type:Schema.Types.ObjectId,
        ref:'Course',
        required:true
    },
    razorpayOrderId: {
         type: String,
         required: true
         },
    razorpayPaymentId: { 
        type: String 
    },
    amount: { 
        type: Number, 
        required: true 
    },
    status: {
      type: String,
      required: true,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },

},
{timestamps: true})

export const Order = model('Order',orderSchema)