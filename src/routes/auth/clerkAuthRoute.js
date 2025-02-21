import { Router } from "express";
import { userCreateWebhook } from "../../webhooks/clerk/authWebhook.js";
import bodyParser from "body-parser";
import express from 'express'



const router = Router()

router.use(express.urlencoded({
    limit:"20kb",
    extended:true,
}))

router.route('/clerk').post(userCreateWebhook)

export default router