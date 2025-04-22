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
router.route('/approve-teacher').post(requireAuth(), approveTeacher)
router.route('/get-Teacher-application').get(requireAuth(), getApprovelApplication)
router.route('/get-approvel-application-by-id').get(requireAuth(),getApprovelApplicationByID)
// route for student or teacher
router.route('/apply-for-teacher').post(requireAuth(), teacherApplication)
router.route('/get-cloudfront-cookie').post(requireAuth(),getCloudFrontCookies)
router.route('/get-purchased-courses').get(requireAuth(),getStudentPurchasedCourses)


export default router
