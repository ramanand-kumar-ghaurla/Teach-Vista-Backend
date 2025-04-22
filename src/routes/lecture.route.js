import { Router } from "express";
import {compeleteMultipartUpload,getPresignedURL,initiateMultipart} from '../utils/cloud/uploadLectureOnS3.js'
import {verifyContainerRes} from '../webhooks/videoService/verifyTranscodingRes.js'
import { createLecture,getStatusBasisLecture,getAllCreatedLecturesBYTeacher } from "../controllers/lecture.controller.js";
import { requireAuth } from "@clerk/express";

const router = Router()

// multipart video routes

router.route('/initiate-multipart-upload').post(initiateMultipart)
router.route('/get-presigned-url').get(getPresignedURL)
router.route('/complete-multipart-upload').post(compeleteMultipartUpload)

// route for verifying container response after successfull transcoding

router.route('/verify-transcoding-resonse').post( verifyContainerRes)

// route related to lectureStatus

router.route('/create-lecture').post(requireAuth(),createLecture)
router.route('/get-statusbased-lecture').get(requireAuth(),getStatusBasisLecture)
router.route('/get-all-lectures-of-teacher').get(requireAuth(),getAllCreatedLecturesBYTeacher)
export default router