import {  Router } from "express";
import { requireAuth } from "@clerk/express";
import { approveTeacher,
         teacherApplication,
         getCloudFrontCookies,
         getApprovelApplication,
         getApprovelApplicationByID,
         getStudentPurchasedCourses
 } from "../../controllers/user.controller.js";

const router = Router()
// route for admin only
router.route('/approve-teacher').post( approveTeacher)
router.route('/get-approvel-application').get(getApprovelApplication)
router.route('/get-approvel-application-by-id').get(getApprovelApplicationByID)
// route for student or teacher
router.route('/apply-for-teacher').post( teacherApplication)
router.route('/get-cloudfront-cookie').post(getCloudFrontCookies)
router.route('/get-purchased-courses').get(getStudentPurchasedCourses)


export default router
