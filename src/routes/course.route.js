import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { createCourse , getCreatedCourse,getCourseById} from "../controllers/course.controller.js";



// const fakeAuth = (req, res, next) => {
//     console.log("🧪 Fake auth passed");
//     req.auth = { userId: "user_2tLeuTWEBa5nuZ8MfyVnYMeAdkN" }; // manually inject for test
//     next();
//   };
const router = Router()
// TODO: add clerk middleware in these routes
// for Teacher only routes
router.route('/create-course').post(requireAuth() ,createCourse)
router.route('/get-created-course').get(getCreatedCourse)

// public routes 
router.route('/get-course-by-id').get(getCourseById)

export default router