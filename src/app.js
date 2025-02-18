import express from "express";

import cors from 'cors'
import dotenv from 'dotenv'
dotenv.config();
import bodyParser from "body-parser";



const app = express()

app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))


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
app.use(express.static("public"))



export {app};