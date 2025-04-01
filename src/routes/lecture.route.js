import { Router } from "express";
import {compeleteMultipartUpload,getPresignedURL,initiateMultipart} from '../utils/cloud/uploadLectureOnS3.js'
import {verifyContainerRes} from '../webhooks/videoService/verifyTranscodingRes.js'
import { createLecture } from "../controllers/lecture.controller.js";

const router = Router()

// multipart video routes

router.route('/initiate-multipart-upload').post(initiateMultipart)
router.route('/get-presigned-url').get(getPresignedURL)
router.route('/complete-multipart-upload').post(compeleteMultipartUpload)

// route for verifying container response after successfull transcoding

router.route('/verify-transcoding-resonse').post( verifyContainerRes)

// route related to lectureStatus

router.route('/create-lecture').post(createLecture)

export default router