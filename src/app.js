import express from "express";

import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config();
import bodyParser from "body-parser";
import {clerkMiddleware,requireAuth} from '@clerk/express'

import clerkWebhookRoute from './routes/auth/clerkAuthRoute.js'
import userRoute from './routes/auth/user.route.js'



const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))

app.use(clerkMiddleware({
   publishableKey:process.env.CLERK_PUBLIC_KEY,
   secretKey:process.env.CLERK_SECRET_KEY}))


app.use(express.json(
    {limit:"20kb"}
))

app.use(bodyParser.json());
app.use(cors({
    credentials:true,
    origin:process.env.CORS_ORIGIN
}))


app.use(express.urlencoded({
    limit:"20kb",
    extended:true,
}))



app.get('/', (req, res) => {
    res.send("Welcome to TeachVista Backend API!");
});

app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// define the routes 

app.use('/api/v1/webhook',clerkWebhookRoute)
app.use('/api/v1/user',userRoute)

app.use(express.static("public"))

export {app};