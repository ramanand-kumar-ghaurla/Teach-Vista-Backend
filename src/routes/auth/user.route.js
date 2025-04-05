import {  Router } from "express";
import { requireAuth } from "@clerk/express";
import { approveTeacher,
         teacherApplication,
         getCloudFrontCookies
 } from "../../controllers/user.controller.js";

const router = Router()

router.route('/approve-teacher').post( approveTeacher)
router.route('/apply-for-teacher').post( teacherApplication)
router.route('/get-cloudfront-cookie').post(getCloudFrontCookies)

export default router
