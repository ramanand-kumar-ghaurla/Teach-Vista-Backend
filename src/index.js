
import dotenv from 'dotenv'
dotenv.config()
import { app } from './app.js'
import connectToDatabase from './utils/database.js'

connectToDatabase().then(()=>{
    app.listen(process.env.PORT || 9000 ,()=>{
        console.log(`app is listening on port no. ${process.env.PORT}`)
    })

    
}).catch((error)=>{
    console.log('error in starting server',error)
})


