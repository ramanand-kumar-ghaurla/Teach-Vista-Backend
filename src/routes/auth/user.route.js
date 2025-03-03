import {  Router } from "express";
import { requireAuth } from "@clerk/express";
import { approveTeacher,
         teacherApplication
 } from "../../controllers/user.controller.js";

const router = Router()

router.route('/approve-teacher').post( approveTeacher)
router.route('/apply-for-teacher').post( teacherApplication)

export default router