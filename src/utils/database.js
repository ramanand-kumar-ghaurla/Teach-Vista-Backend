import mongoose from "mongoose";
import { configDotenv } from "dotenv";
configDotenv()

const connectToDatabase = async()=>{

   try {
     const instance = await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DATABASE_NAME}`)
     console.log(`database connected !!  on host : ${instance.connection.host}`)
   } catch (error) {
    console.log('error in connecting to database',error)
    process.exit(1)
   }
}

export default connectToDatabase