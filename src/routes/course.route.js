import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { createCourse , getCreatedCourse} from "../controllers/course.controller.js";



const router = Router()
// TODO: add clerk middleware in these routes
// for Teacher only routes
router.route('/create-course').post(createCourse)
router.route('/get-created-course').get(getCreatedCourse)

export default router