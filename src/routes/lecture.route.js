import { Router } from "express";
import {compeleteMultipartUpload,getPresignedURL,initiateMultipart} from '../utils/cloud/uploadLectureOnS3.js'

const router = Router()

// multipart video routes

router.route('/initiate-multipart-upload').post(initiateMultipart)
router.route('/get-presigned-url').get(getPresignedURL)
router.route('/complete-multipart-upload').post(compeleteMultipartUpload)

export default router