import {  Router } from "express";
import { requireAuth } from "@clerk/express";
import { approveTeacher } from "../../controllers/user.controller.js";

const router = Router()

router.route('/approve-teacher').post( approveTeacher)

export default router